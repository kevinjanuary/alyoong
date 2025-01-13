import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { currencyFormat } from "@/lib/currencyFormat"
import { db } from "@/lib/prismadb"
import { cn } from "@/lib/utils"
import { imageLoader } from "@/lib/utils-client"
import { format, formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"
import { StarIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const AdminReviewsPage = async () => {
  const reviews = await db.review.findMany({
    include: {
      product: true,
      transaction: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div className="space-y-4">
      <h1 className="text-xl">Reviews</h1>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Created at</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-14 h-14 relative overflow-hidden rounded-md">
                      <Image
                        loader={imageLoader}
                        src={review.product.images}
                        alt={review.product.name}
                        width={56}
                        height={56}
                        className="object-cover h-full w-full"
                      />
                    </div>
                    <Link href={`/product/${review.product.id}`}>
                      {review.product.name}
                    </Link>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage
                        src={
                          process.env.NEXT_PUBLIC_IMAGE_URL! +
                          review.transaction.user.image
                        }
                      />
                      <AvatarFallback>
                        {review.transaction.user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span>{review.transaction.user.name}</span>
                  </div>
                </TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell>{review.review}</TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(review.createdAt), {
                    addSuffix: true,
                    locale: id,
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default AdminReviewsPage
