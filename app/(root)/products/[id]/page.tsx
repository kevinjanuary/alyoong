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

const ProductsPage = async ({ params: { id } }: { params: { id: string } }) => {
  const currentUser = await getCurrentUser()

  const product = await db.product.findUnique({
    where: {
      id: id,
    },
    include: {
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

  const origin = product.user.addresses[0]

  return (
    <div className="max-w-6xl mx-auto flex gap-8 p-4">
      <div className="w-1/2">
        <div className=" bg-white rounded-lg border">
          <Image
            src={product.images}
            alt={product.name}
            width={200}
            height={200}
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
          currentUser?.id != product.user.id ? (
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
              <span className="font-semibold">Stock: {product.stock} pcs</span>
            </div>
          )
        ) : (
          <Button>Login untuk membeli</Button>
        )}
        <Separator />
        <span>
          Warranty: {product.warranty}
          {product.warranty == "Active" &&
            ` (${product.warranty_detail} months)`}
        </span>
        <span>Weight: {product.weight} grams</span>
        <span>
          Dimension: {product.length} x {product.width} x {product.height}cm
        </span>
        <Accordion type="single" defaultValue="item-1" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Description</AccordionTrigger>
            <AccordionContent>{product.description}</AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="flex gap-4 items-center">
          <Avatar>
            <AvatarImage src={product.user.image || undefined} />
            <AvatarFallback>GT</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold">{product.user.name}</span>
            <span className="text-sm">
              Member since{" "}
              {product.user.createdAt.toLocaleDateString("id-ID", {
                day: "2-digit",
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
  )
}

export default ProductsPage
