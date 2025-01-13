import { db } from "@/lib/prismadb"
import { getCurrentUser } from "@/lib/session"
import { shipping_status } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const { id, resi } = await request.json()

  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      { status: 401 }
    )
  }

  await db.transaction.update({
    where: {
      id,
      product: {
        userId: user.id,
      },
    },
    data: {
      no_resi: resi,
      shipping_status: shipping_status.SHIPPING,
      user: {
        update: {
          notification: {
            create: {
              title: "",
              message: `Barang pesanan-mu sudah dikirim oleh penjual dengan nomor resi ${resi}.`,
              url: "/dashboard/transactions",
            },
          },
        },
      },
    },
  })

  return NextResponse.json({ id, resi }, { status: 200 })
}
