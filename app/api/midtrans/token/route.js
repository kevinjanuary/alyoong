import { NextResponse } from "next/server"
import Midtrans from "midtrans-client"

let snap = new Midtrans.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
})

export async function POST(request) {
  const { order_id, gross_amount } = await request.json()

  const token = await snap.createTransactionToken({
    transaction_details: {
      order_id: order_id,
      gross_amount: gross_amount,
    },
  })

  return NextResponse.json({ token })
}
