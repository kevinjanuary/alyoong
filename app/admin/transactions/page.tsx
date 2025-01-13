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
import { format, formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"
import Link from "next/link"

const AdminTransactionPage = async () => {
  const transactions = await db.transaction.findMany({
    include: {
      user: true,
      product: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div className="space-y-4">
      <h1 className="text-xl">Transactions</h1>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Buyer</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Payment status</TableHead>
              <TableHead>Shipping status</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Created at</TableHead>
              <TableHead>Updated at</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.id.toUpperCase()}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Avatar>
                      <AvatarImage
                        src={
                          process.env.NEXT_PUBLIC_IMAGE_URL! +
                            transaction.user.image || undefined
                        }
                      />
                      <AvatarFallback>
                        {transaction.user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <span>{transaction.user.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Link href={`/products/${transaction.product.id}`}>
                    {transaction.product.name}
                  </Link>
                </TableCell>
                <TableCell>
                  Rp {currencyFormat(Number(transaction.price))}
                </TableCell>
                <TableCell>{transaction.payment_status}</TableCell>
                <TableCell>{transaction.shipping_status}</TableCell>
                <TableCell>{transaction.payment_method}</TableCell>
                <TableCell>
                  {format(transaction.createdAt, "yyyy-MM-dd HH:mm:ss")}
                </TableCell>
                <TableCell>
                  {formatDistanceToNow(transaction.updatedAt, {
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

export default AdminTransactionPage
