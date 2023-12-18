import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { db } from "@/lib/prismadb"
import { User } from "@prisma/client"
import Image from "next/image"
import Link from "next/link"
import { currencyFormat } from "@/lib/currencyFormat"
import { Badge } from "@/components/ui/badge"
import { NoData } from "../../../_components/no-data"

export async function ProductsTable({ currentUser }: { currentUser: User }) {
  const products = await db.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      userId: currentUser.id,
    },
  })

  return (
    <>
      {products.length > 0 ? (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="">Product</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="w-44">Condition</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="">
                    <div className="grid grid-cols-[64px,auto] gap-4 items-center">
                      <div className="mb-auto">
                        <Image
                          src={
                            product.images ||
                            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                          }
                          alt={product.name}
                          width={64}
                          height={64}
                          className="w-16 h-16 overflow-hidden rounded-md aspect-square object-contain border"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          <Link href={`/products/${product.id}`}>
                            {product.name}
                          </Link>
                        </span>
                        <span className="text-xs text-muted-foreground line-clamp-2">
                          {product.description}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    Rp{currencyFormat(Number(product.price))}
                  </TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.condition}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <NoData
          title="Yahh! Kamu belum punya produk nih!"
          description="Kamu harus punya produk untuk bisa jualan di Alyoong. Yukk tambahin satu produk dulu!"
        />
      )}
    </>
  )
}
