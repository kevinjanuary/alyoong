import { getCurrentUser } from "@/lib/session"
import { PageHeading } from "../_components/page-heading"
import { redirect } from "next/navigation"
import { db } from "@/lib/prismadb"
import { currencyFormat } from "@/lib/currencyFormat"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { payment_status, shipping_status } from "@prisma/client"
import { NoData } from "../_components/no-data"
import { ManageOrder } from "./_components/manage-order"

const OrdersPage = async () => {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
  }

  const orders = await db.transaction.findMany({
    where: {
      payment_status: payment_status.PAID,
      product: {
        userId: user.id,
      },
    },
    include: {
      user: true,
      product: {
        include: {
          user: true,
        },
      },
    },
  })

  return (
    <div>
      <PageHeading
        title="Pesanan"
        subtitle="Lihat daftar barang yang dipesan oleh pelanggan."
      />
      <div className="flex flex-col gap-4">
        {orders.length > 0 ? (
          orders.map((item) => (
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
                <Badge variant="default" className="normal-case">
                  {item.shipping_status === shipping_status.PENDING_SHIPPING
                    ? "Menunggu dikirim"
                    : item.shipping_status === shipping_status.SHIPPING
                    ? "Sedang dikirim"
                    : item.shipping_status === shipping_status.DELIVERED
                    ? "Sudah diterima"
                    : "Dibatalkan"}
                </Badge>
              </div>
              <span className="font-medium">{item.user.name}</span>
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
                    Total pendapatan
                  </span>
                  <span className="text-sm font-medium">
                    Rp{currencyFormat(Number(item.total))}
                  </span>
                </div>
                <ManageOrder id={item.id} />
              </div>
            </div>
          ))
        ) : (
          <NoData
            title="Yahh! Kamu belum punya pesanan nih!"
            description="Bagikan link produk kamu ke teman-temanmu agar mereka bisa membeli produk kamu. Lihat daftar produk yang kamu jual di halaman produk. Yukk mulai jualan!"
          />
        )}
      </div>
    </div>
  )
}

export default OrdersPage
