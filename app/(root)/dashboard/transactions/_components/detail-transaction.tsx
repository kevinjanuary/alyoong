"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  type Product,
  shipping_status,
  type Transaction,
  User,
} from "@prisma/client"
import Image from "next/image"
import { currencyFormat } from "@/lib/currencyFormat"

export function DetailTransaction({
  transaction,
}: {
  transaction: Transaction & {
    product: Product & {
      user: User
    }
  }
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Detail transaksi</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detail transaksi</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col space-y-4 p-4 overflow-auto">
          <div className="border rounded-md py-2 px-4 text-sm space-y-1">
            <div className="flex">
              <span className="w-1/2">Status</span>
              <span className="w-1/2 font-medium text-right">
                {transaction.payment_status === "PAID"
                  ? transaction.shipping_status ===
                    shipping_status.PENDING_SHIPPING
                    ? "Menunggu dikirim"
                    : transaction.shipping_status === shipping_status.SHIPPING
                    ? "Sedang dikirim"
                    : transaction.shipping_status === shipping_status.DELIVERED
                    ? "Sudah diterima"
                    : "Dibatalkan"
                  : transaction.payment_status}
              </span>
            </div>
            <div className="flex">
              <span className="w-1/2">Tanggal pembelian</span>
              <span className="w-1/2 font-medium text-right">
                {transaction.createdAt.toLocaleString("id-ID", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                }) +
                  ", pukul " +
                  transaction.createdAt.toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZoneName: "short",
                  })}
              </span>
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <span className="font-medium">Detail produk</span>

            <div className="flex space-x-4">
              <Image
                src={transaction.product.images}
                alt={transaction.product.name}
                width={64}
                height={64}
                className="object-contain rounded-lg w-16"
              />
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium">
                  {transaction.product.name}
                </span>
                <div className="flex text-muted-foreground text-xs">
                  <span>
                    {transaction.quantity} barang x Rp
                    {currencyFormat(Number(transaction.price))}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">
                Total belanjamu
              </span>
              <span className="text-sm font-medium">
                Rp{currencyFormat(Number(transaction.total))}
              </span>
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <span className="font-medium">Info pengiriman</span>
            <div className="flex space-x-4 text-sm">
              <div className="flex flex-col text-muted-foreground shrink-0 space-y-1">
                <span>Pilihan kurir</span>
                <span>Nomor resi</span>
                <span>Alamat pengiriman</span>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="flex gap-1">
                  :<span>{transaction.courier.toUpperCase()}</span>
                </span>
                <span className="flex gap-1">
                  :<span>{transaction.no_resi}</span>
                </span>
                <span className="flex gap-1">
                  :
                  <span>
                    {transaction.address.split("\n").map((address, index) => (
                      <div key={index}>{address}</div>
                    ))}
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <span className="font-medium">Rincian pembayaran</span>
            <div className="flex space-x-4 text-sm">
              <div className="flex flex-col text-muted-foreground shrink-0 space-y-1">
                <span>Metode pembayaran</span>
                <span>Total harga ({transaction.quantity} barang)</span>
                <span>Total ongkir ({transaction.weight} gram)</span>
                <span>Biaya layanan</span>
                <span>Total pembayaran</span>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="flex gap-1">
                  :<span>{transaction.payment_method?.toUpperCase()}</span>
                </span>
                <span className="flex gap-1">
                  :<span>Rp {currencyFormat(Number(transaction.price))}</span>
                </span>
                <span className="flex gap-1">
                  :
                  <span>
                    Rp {currencyFormat(Number(transaction.shipping_cost))}
                  </span>
                </span>
                <span className="flex gap-1">
                  :
                  <span>
                    Rp {currencyFormat(Number(transaction.services_fee))}
                  </span>
                </span>
                <span className="flex gap-1">
                  :<span>Rp {currencyFormat(Number(transaction.total))}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
