import { db } from "@/lib/prismadb"
import { getCurrentUser } from "@/lib/session"
import { shipping_status } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

  const { id } = await request.json()

  const transaction = await db.transaction.findUnique({
    where: {
      id,
    },
    select: {
      userId: true,
      price: true,
      product: {
        select: {
          userId: true,
        },
      },
    },
  })

  if (!transaction)
    return NextResponse.json(
      { message: "Transaction not found" },
      { status: 404 }
    )

  if (transaction.userId !== user.id)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

  await db.$transaction([
    db.transaction.update({
      where: {
        id,
        userId: transaction.userId,
      },
      data: {
        shipping_status: shipping_status.DELIVERED,
      },
    }),
    db.user.update({
      where: {
        id: transaction.product.userId,
      },
      data: {
        balance: {
          increment: Number(transaction.price),
        },
      },
    }),
  ])

  return NextResponse.json({ id }, { status: 200 })
}
