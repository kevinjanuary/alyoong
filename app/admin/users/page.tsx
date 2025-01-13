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
import { format } from "date-fns"

const AdminUsersPage = async () => {
  const users = await db.user.findMany({
    include: {
      _count: {
        select: {
          addresses: true,
          products: true,
          comments: true,
          transactions: true,
        },
      },
    },
    orderBy: {
      transactions: {
        _count: "desc",
      },
    },
  })

  return (
    <div className="space-y-4">
      <h1 className="text-xl">Users</h1>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="min-w-[120px]">Created at</TableHead>
              <TableHead>Addresses</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Comments</TableHead>
              <TableHead>Transactions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage
                        src={
                          process.env.NEXT_PUBLIC_IMAGE_URL! + user.image ||
                          undefined
                        }
                      />
                      <AvatarFallback>
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col">
                      <span>{user.name}</span>
                      <span>{user.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>Rp {currencyFormat(user.balance)}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  {format(user.createdAt, "yyyy-MM-dd HH:mm:ss")}
                </TableCell>
                <TableCell className="text-center">
                  {user._count.addresses}
                </TableCell>
                <TableCell className="text-center">
                  {user._count.products}
                </TableCell>
                <TableCell className="text-center">
                  {user._count.comments}
                </TableCell>
                <TableCell className="text-center">
                  {user._count.transactions}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default AdminUsersPage
