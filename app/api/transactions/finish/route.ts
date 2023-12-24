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
    },
  })

  if (!transaction)
    return NextResponse.json(
      { message: "Transaction not found" },
      { status: 404 }
    )

  if (transaction.userId !== user.id)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

  await db.transaction.update({
    where: {
      id,
      userId: user.id,
    },
    data: {
      shipping_status: shipping_status.DELIVERED,
    },
  })

  return NextResponse.json({ id }, { status: 200 })
}
