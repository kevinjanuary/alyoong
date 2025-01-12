"use server"

import { db } from "@/lib/prismadb"
import { getCurrentUser } from "@/lib/session"
import { redirect } from "next/navigation"
import { z } from "zod"

export const addReviewAction = async (data: unknown) => {
  const result = z
    .object({
      transactionId: z.string(),
      stars: z.number().gte(1).lte(5),
      review: z.string().trim().min(1).max(500),
    })
    .safeParse(data)

  if (!result.success) {
    return {
      success: false,
      message: "Data tidak valid",
    }
  }

  const user = await getCurrentUser()
  if (!user) {
    redirect("/login?redirect=/dashboard/transactions")
  }

  const transaction = await db.transaction.findUnique({
    where: {
      id: result.data.transactionId,
    },
    select: {
      id: true,
      productId: true,
    },
  })

  if (!transaction) {
    return {
      success: false,
      message: "Transaksi tidak ditemukan",
    }
  }

  await db.review.create({
    data: {
      transactionId: transaction.id,
      productId: transaction.productId,
      rating: result.data.stars,
      review: result.data.review,
    },
  })

  return {
    success: true,
    message: "Ulasan berhasil ditambahkan",
  }
}
