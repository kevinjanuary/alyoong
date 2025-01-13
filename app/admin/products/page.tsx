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

const AdminTransactionPage = async () => {
  const products = await db.product.findMany({
    include: {
      user: true,
      _count: {
        select: {
          comments: true,
          transactions: true,
          reviews: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div className="space-y-4">
      <h1 className="text-xl">Products</h1>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead className="min-w-[130px]">Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Created at</TableHead>
              <TableHead className="min-w-[106px]">Updated at</TableHead>
              <TableHead>Comments</TableHead>
              <TableHead>Transactions</TableHead>
              <TableHead>Reviews</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex gap-4">
                    <div className="w-14 h-14 shrink-0 overflow-hidden rounded-md flex">
                      <Image
                        loader={imageLoader}
                        src={product.images}
                        width={56}
                        height={56}
                        alt={product.name}
                        className="object-cover items-center justify-center w-full h-full"
                      />
                    </div>

                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">
                        {product.id.toUpperCase()}
                      </span>
                      <Link
                        href={`/products/${product.id}`}
                        className="font-medium"
                      >
                        {product.name}
                      </Link>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  Rp {currencyFormat(Number(product.price))}
                </TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  {format(new Date(product.createdAt), "dd/MM/yyyy HH:mm")}
                </TableCell>
                <TableCell>
                  {product.createdAt === product.updatedAt
                    ? format(new Date(product.createdAt), "dd/MM/yyyy HH:mm")
                    : formatDistanceToNow(product.updatedAt, {
                        addSuffix: true,
                        locale: id,
                      })}
                </TableCell>
                <TableCell>{product._count.comments}</TableCell>
                <TableCell>{product._count.transactions}</TableCell>
                <TableCell>{product._count.reviews}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default AdminTransactionPage
