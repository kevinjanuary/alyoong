import { db } from "@/lib/prismadb"
import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { payment_status } from "@prisma/client"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const transaction = await db.transaction.findUnique({
      where: {
        id: data.order_id,
      },
      include: {
        product: true,
      },
    })
    if (!transaction) throw "Transaction not found"

    const hash = crypto
      .createHash("sha512")
      .update(
        `${transaction.id}${data.status_code}${transaction.total}.00${process.env.MIDTRANS_SERVER_KEY}`
      )
      .digest("hex")
    if (data.signature_key !== hash) throw "Invalid signature key"

    const orderId = data.order_id
    const transactionStatus = data.transaction_status
    const fraudStatus = data.fraud_status
    console.log(
      `Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`
    )

    if (transactionStatus == "capture") {
      if (fraudStatus == "accept") {
        await db.product.update({
          where: {
            id: transaction.productId,
          },
          data: {
            stock: transaction.product.stock - transaction.quantity,
          },
        })
        await db.transaction.update({
          where: {
            id: data.order_id,
          },
          data: {
            payment_status: payment_status.PAID,
            payment_method: data.payment_type,
          },
        })
      }
    } else if (transactionStatus == "settlement") {
      await db.product.update({
        where: {
          id: transaction.productId,
        },
        data: {
          stock: transaction.product.stock - transaction.quantity,
        },
      })
      await db.transaction.update({
        where: {
          id: data.order_id,
        },
        data: {
          payment_status: payment_status.PAID,
          payment_method: data.payment_type,
        },
      })
    } else if (
      transactionStatus == "cancel" ||
      transactionStatus == "deny" ||
      transactionStatus == "expire"
    ) {
      await db.transaction.update({
        where: {
          id: data.order_id,
        },
        data: {
          payment_status: payment_status.CANCELED,
        },
      })
    } else if (transactionStatus == "pending") {
      await db.transaction.update({
        where: {
          id: data.order_id,
        },
        data: {
          payment_status: payment_status.PENDING_PAYMENT,
        },
      })
    }
  } catch (e) {
    console.log(e)
  } finally {
    return NextResponse.json(
      { status: "success", message: "OK" },
      { status: 200 }
    )
  }
}
