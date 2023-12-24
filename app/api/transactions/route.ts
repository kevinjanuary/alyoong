import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/session"
import { db } from "@/lib/prismadb"
import { payment_status } from "@prisma/client"

export async function POST(request: NextRequest) {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const data = await request.json()
  const services_fee = Number(process.env.SERVICES_FEE || 5000)

  const newTransaction = await db.transaction.create({
    data: {
      userId: currentUser.id,
      productId: data.productId,
      address: data.address,
      price: data.price,
      quantity: data.quantity,
      shipping_cost: data.shippingCost,
      services_fee: services_fee,
      total: data.price * data.quantity + data.shippingCost + services_fee,
      payment_status: payment_status.PENDING_PAYMENT,
    },
  })

  const res = await fetch("http://localhost:3000/api/midtrans/token", {
    method: "POST",
    body: JSON.stringify({
      order_id: newTransaction.id,
      gross_amount: newTransaction.total,
    }),
  })
  const { token } = await res.json()

  if (!token) {
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    )
  }
  await db.transaction.update({
    where: {
      id: newTransaction.id,
    },
    data: {
      snap_token: token,
    },
  })

  return NextResponse.json(
    { ...newTransaction, snap_token: token },
    { status: 200 }
  )
}
