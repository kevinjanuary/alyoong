import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
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
import { ProductApprovalStatus } from "@/lib/types"
import { imageLoader } from "@/lib/utils-client"
import { format, formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"
import Image from "next/image"
import Link from "next/link"
import { ApproveProduct, RejectProduct } from "./_components/approval"

const AdminTransactionPage = async () => {
  const products = await db.product.findMany({
    where: {
      approval_status: ProductApprovalStatus.PENDING,
    },
    include: {
      user: true,
    },
    orderBy: {
      updatedAt: "asc",
    },
  })

  return (
    <div className="space-y-4">
      <h1 className="text-xl">New Products (Pending Approval)</h1>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Seller</TableHead>
              <TableHead>Product</TableHead>
              <TableHead className="min-w-[106px]">Updated at</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage
                        src={
                          process.env.NEXT_PUBLIC_IMAGE_URL! +
                            product.user.image || undefined
                        }
                      />
                      <AvatarFallback>
                        {product.user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col">
                      <span>{product.user.name}</span>
                      <span>{product.user.email}</span>
                    </div>
                  </div>
                </TableCell>
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

                      <span>
                        Rp {currencyFormat(Number(product.price))} (Stock:{" "}
                        {product.stock})
                      </span>

                      <div className="flex flex-col text-xs text-gray-500">
                        <span className="text-xs text-gray-500">
                          {product.condition}
                        </span>
                        <span>
                          {product.category}{" "}
                          {product.subcategory && `(${product.subcategory})`}
                        </span>
                        <span>
                          Garansi: {product.warranty}{" "}
                          {product.warranty === "Active" &&
                            `(${product.warranty_detail} bulan)`}
                        </span>
                        <span className="text-xs text-gray-500">
                          {product.length} x {product.width} x {product.height}{" "}
                          cm, {product.weight} gram
                        </span>
                        <span>{product.description}</span>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {product.createdAt === product.updatedAt
                    ? format(new Date(product.createdAt), "dd/MM/yyyy HH:mm")
                    : formatDistanceToNow(product.updatedAt, {
                        addSuffix: true,
                        locale: id,
                      })}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <ApproveProduct productId={product.id} />
                    <RejectProduct productId={product.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default AdminTransactionPage
