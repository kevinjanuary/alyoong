"use server"

import { db } from "@/lib/prismadb"
import { getCurrentUser } from "@/lib/session"
import { ProductApprovalStatus, UserRoles } from "@/lib/types"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

export const approveProductAction = async (data: unknown) => {
  const result = z
    .object({
      productId: z.string(),
    })
    .safeParse(data)

  if (!result.success) {
    return {
      success: false,
      message: "Invalid data",
    }
  }

  const user = await getCurrentUser()
  if (!user || user.role !== UserRoles.ADMIN) {
    redirect("/")
  }

  await db.product.update({
    where: {
      id: result.data.productId,
    },
    data: {
      approval_status: ProductApprovalStatus.APPROVED,
    },
  })

  revalidatePath("/admin/products/new")

  return {
    success: true,
  }
}

export const rejectProductAction = async (data: unknown) => {
  const result = z
    .object({
      productId: z.string(),
      reason: z.string().trim().min(1).max(200),
    })
    .safeParse(data)

  if (!result.success) {
    return {
      success: false,
      message: "Invalid data",
    }
  }

  const user = await getCurrentUser()
  if (!user || user.role !== UserRoles.ADMIN) {
    redirect("/")
  }

  await db.product.update({
    where: {
      id: result.data.productId,
    },
    data: {
      approval_status: ProductApprovalStatus.REJECTED,
      rejection_reason: result.data.reason,
    },
  })

  revalidatePath("/admin/products/new")

  return {
    success: true,
  }
}
