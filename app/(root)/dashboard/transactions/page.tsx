import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { currencyFormat } from "@/lib/currencyFormat"
import { db } from "@/lib/prismadb"
import { getCurrentUser } from "@/lib/session"
import Image from "next/image"
import { redirect } from "next/navigation"
import { Pay } from "./_components/pay"
import { payment_status, shipping_status } from "@prisma/client"
import { PageHeading } from "../_components/page-heading"
import { NoData } from "../_components/no-data"

const TransactionsPage = async () => {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
  }

  const transactions = await db.transaction.findMany({
    where: {
      userId: user.id,
    },
    include: {
      product: {
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
    <>
      <Pay />
      <PageHeading title="Transaksi" subtitle="Lihat daftar transaksi" />
      <div className="flex flex-col gap-4">
        {transactions.length > 0 ? (
          transactions.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-2 border rounded-md p-4"
            >
              <div className="flex gap-2 text-xs items-center">
                <span>
                  {item.createdAt.toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                {item.payment_status === payment_status.PAID ? (
                  <Badge variant="default" className="normal-case">
                    {item.shipping_status === shipping_status.PENDING_SHIPPING
                      ? "Menunggu dikirim"
                      : item.shipping_status === shipping_status.SHIPPING
                      ? "Sedang dikirim"
                      : item.shipping_status === shipping_status.DELIVERED
                      ? "Sudah diterima"
                      : "Dibatalkan"}
                  </Badge>
                ) : (
                  <Badge variant="default" className="normal-case">
                    {item.payment_status}
                  </Badge>
                )}
              </div>
              <span>{item.product.user.name}</span>
              <div className="grid grid-cols-[64px,auto] gap-4">
                <Image
                  src={item.product.images}
                  alt={item.product.name}
                  width={64}
                  height={64}
                  className="block rounded-lg"
                />
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">
                    {item.product.name}
                  </span>
                  <div className="flex gap-2 text-muted-foreground text-xs">
                    <span>
                      {item.quantity} barang x Rp
                      {currencyFormat(Number(item.price))}
                    </span>
                  </div>
                  <span className="text-sm font-medium"></span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">
                    Total belanjamu
                  </span>
                  <span className="text-sm font-medium">
                    Rp{currencyFormat(Number(item.total))}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline">Lihat detail</Button>
                  {item.payment_status === payment_status.PENDING_PAYMENT && (
                    <Button>Bayar</Button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <NoData
            title="Yahh! Kamu belum punya transaksi!"
            description="Kamu belum pernah melakukan transaksi di Alyoong. Yukk cari barang impianmu dan belanja sekarang!"
          />
        )}
      </div>
    </>
  )
}

export default TransactionsPage
