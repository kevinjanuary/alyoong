import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { db } from "@/lib/prismadb"
import { User } from "@prisma/client"
import { NoData } from "../../../_components/no-data"
import ProductsTableBody from "./table-body"

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
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product, index) => (
                <ProductsTableBody key={index} product={product} />
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
