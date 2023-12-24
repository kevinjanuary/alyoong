import { db } from "@/lib/prismadb"
import { shipping_status } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const { id, resi } = await request.json()

  await db.transaction.update({
    where: {
      id,
    },
    data: {
      no_resi: resi,
      shipping_status: shipping_status.SHIPPING,
    },
  })

  return NextResponse.json({ id, resi }, { status: 200 })
}
