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
import { imageLoader } from "@/lib/utils-client"
import { format, formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"
import Image from "next/image"
import Link from "next/link"

const AdminCommentsPage = async () => {
  const comments = await db.comment.findMany({
    include: {
      user: true,
      product: true,
      parent: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div className="space-y-4">
      <h1 className="text-xl">Comments</h1>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Replies for</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Created at</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {comments.map((comment) => (
              <TableRow key={comment.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-14 h-14 relative overflow-hidden rounded-md">
                      <Image
                        loader={imageLoader}
                        src={comment.product.images}
                        alt={comment.product.name}
                        width={56}
                        height={56}
                        className="object-cover h-full w-full"
                      />
                    </div>
                    <Link href={`/products/${comment.product.id}`}>
                      {comment.product.name}
                    </Link>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage
                        src={
                          process.env.NEXT_PUBLIC_IMAGE_URL! +
                            comment.user.image || undefined
                        }
                      />
                      <AvatarFallback>
                        {comment.user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span>{comment.user.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {comment.parent ? comment.parent.comment : "None"}
                </TableCell>
                <TableCell>{comment.comment}</TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(comment.createdAt), {
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

export default AdminCommentsPage
