import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"
import { currencyFormat } from "@/lib/currencyFormat"
import Image from "next/image"
import { BuyProduct } from "./_components/buy-product"
import { notFound } from "next/navigation"
import { db } from "@/lib/prismadb"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getCurrentUser } from "@/lib/session"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import DiscussionForm from "./_components/discussion-form"
import { DiscussionReply } from "./_components/discussion-reply"
import { imageLoader } from "@/lib/utils-client"
import { StarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { id as idLocale } from "date-fns/locale"

const ProductsPage = async ({ params: { id } }: { params: { id: string } }) => {
  const product = await db.product.findUnique({
    where: {
      id: id,
    },
    include: {
      reviews: {
        include: {
          transaction: {
            include: {
              user: true,
            },
          },
        },
      },
      user: {
        include: {
          addresses: {
            where: {
              primary: true,
            },
          },
        },
      },
    },
  })

  if (!product) {
    return notFound()
  }
  const currentUser = await getCurrentUser()
  const discussions = await db.comment.findMany({
    where: {
      productId: product.id,
      parentId: null,
    },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
      replies: {
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  })

  const origin = product.user.addresses[0]

  return (
    <div className="max-w-screen-xl mx-auto p-4 space-y-8">
      <div className="flex gap-8">
        <div className="w-1/2">
          <div className=" bg-white rounded-lg border">
            <Image
              loader={imageLoader}
              src={product.images}
              alt={product.name}
              width={500}
              height={500}
              className="w-full aspect-square object-contain"
            />
          </div>
        </div>
        <div className="flex flex-col gap-3 w-full py-4">
          <h1 className="font-bold text-2xl">{product.name}</h1>
          <span className="font-semibold">
            Rp{currencyFormat(Number(product.price))}
          </span>
          <div className="flex justify-between mt-4">
            <span>{product.condition}</span>
            <span>{product.category}</span>
          </div>
          <Separator />
          {currentUser ? (
            currentUser?.id !== product.user.id ? (
              product.stock > 0 ? (
                <BuyProduct
                  id={product.id}
                  title={product.name}
                  images={product.images}
                  price={Number(product.price)}
                  stock={product.stock}
                  weight={product.weight}
                  dimension={`${product.length} x ${product.width} x ${product.height}cm`}
                  origin={origin}
                />
              ) : (
                <span className="flex items-center justify-center rounded-md p-2 bg-red-600 text-white">
                  Stok habis!
                </span>
              )
            ) : (
              <div className="flex gap-4 items-center">
                <Button>
                  <Link href={`/dashboard/products/${product.id}/edit`}>
                    Edit product
                  </Link>
                </Button>
                <span className="font-semibold">
                  Stock: {product.stock} pcs
                </span>
              </div>
            )
          ) : (
            <Button>Login untuk membeli</Button>
          )}
          <Separator />
          <span>
            Garansi: {product.warranty === "No" ? "Tidak" : "Ya"}
            {product.warranty == "Active" &&
              ` (${product.warranty_detail} bulan)`}
          </span>
          <span>Berat: {product.weight} gram</span>
          <span>
            Ukuran: {product.length} x {product.width} x {product.height}cm
          </span>
          <Accordion type="single" defaultValue="item-1" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Deskripsi</AccordionTrigger>
              <AccordionContent className="whitespace-pre-line">
                {product.description}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <div className="flex gap-4 items-center">
            <Avatar>
              <AvatarImage
                src={
                  process.env.NEXT_PUBLIC_IMAGE_URL! + product.user.image ||
                  undefined
                }
              />
              <AvatarFallback>
                {product.user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold">{product.user.name}</span>
              <span className="text-sm">
                Bergabung sejak{" "}
                {product.user.createdAt.toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span className="text-sm">
                {origin.city}, {origin.province}
              </span>
            </div>
          </div>
          <Separator />
        </div>
      </div>

      <div className="flex flex-col space-y-4">
        <h4 className="text-xl font-medium">Ulasan</h4>
        {product.reviews.length > 0 ? (
          product.reviews.map((review) => (
            <div key={review.id} className="flex flex-col gap-2 border-b pb-4">
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage
                    src={
                      process.env.NEXT_PUBLIC_IMAGE_URL! +
                        review.transaction.user.image || undefined
                    }
                  />
                  <AvatarFallback>
                    {review.transaction.user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium text-sm">
                    {review.transaction.user.name}
                  </span>

                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(review.createdAt, {
                      addSuffix: true,
                      locale: idLocale,
                    })}
                  </span>
                </div>
              </div>

              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((starValue) => (
                  <StarIcon
                    key={starValue}
                    className={cn(
                      "w-5 h-4 pr-1 last:p-0 last:w-4 fill-gray-200 stroke-gray-200",
                      starValue <= review.rating &&
                        "fill-amber-300 stroke-amber-300"
                    )}
                  />
                ))}
              </div>

              <p>{review.review}</p>
            </div>
          ))
        ) : (
          <p>Belum ada ulasan</p>
        )}
      </div>

      <div className="flex flex-col space-y-4">
        <h4 className="text-xl font-medium">Diskusi</h4>

        {currentUser ? (
          <div className="flex gap-4">
            <Avatar>
              <AvatarImage
                src={
                  process.env.NEXT_PUBLIC_IMAGE_URL! + currentUser.image ||
                  undefined
                }
              />
              <AvatarFallback>
                {currentUser.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <DiscussionForm
              currentUserId={currentUser.id}
              productId={product.id}
            />
          </div>
        ) : (
          <p className="text-sm text-center">Kamu harus login untuk bertanya</p>
        )}

        <div className="space-y-4">
          {discussions.map((discuss) => (
            <div key={discuss.id} className="flex gap-4">
              <Avatar>
                <AvatarImage
                  src={
                    process.env.NEXT_PUBLIC_IMAGE_URL! + discuss.user.image ||
                    undefined
                  }
                />
                <AvatarFallback>
                  {discuss.user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grow border rounded-xl pt-2 pb-4 px-4 text-sm space-y-2">
                <div>
                  <div className="space-x-2">
                    <span className="font-medium">{discuss.user.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(discuss.createdAt, {
                        addSuffix: true,
                        locale: idLocale,
                      })}
                    </span>
                  </div>
                  <p>{discuss.comment}</p>
                  {currentUser && (
                    <DiscussionReply
                      currentUserId={currentUser.id}
                      productId={product.id}
                      parentId={discuss.id}
                    />
                  )}
                </div>

                {discuss.replies.map((reply) => (
                  <div key={reply.id} className="flex gap-4">
                    <Avatar>
                      <AvatarImage
                        src={
                          process.env.NEXT_PUBLIC_IMAGE_URL! +
                            reply.user.image || undefined
                        }
                      />
                      <AvatarFallback>
                        {reply.user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="border rounded-xl py-2 px-4 text-sm">
                      <div className="space-x-2">
                        <span className="font-medium">{reply.user.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(reply.createdAt, {
                            addSuffix: true,
                            locale: idLocale,
                          })}
                        </span>
                      </div>
                      <p>{reply.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProductsPage
