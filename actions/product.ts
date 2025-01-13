"use server"

import { cleanFormat } from "@/lib/currencyFormat"
import { db } from "@/lib/prismadb"
import { getCurrentUser } from "@/lib/session"
import { ProductApprovalStatus, productSchema } from "@/lib/types"
import { revalidatePath } from "next/cache"
import { z } from "zod"

export const deleteProduct = async (data: unknown) => {
  const user = await getCurrentUser()
  if (!user) {
    return {
      success: false,
    }
  }

  const productId = data as string
  const product = await db.product.findUnique({
    where: {
      id: productId,
      userId: user.id,
    },
  })
  if (!product) {
    return {
      success: false,
    }
  }

  await db.product.delete({
    where: {
      id: productId,
    },
  })

  revalidatePath("/dashboard/products")

  return {
    success: true,
  }
}

export const editProduct = async (id: unknown, data: unknown) => {
  const user = await getCurrentUser()
  if (!user) {
    return {
      success: false,
    }
  }

  const productId = id as string
  const product = await db.product.findUnique({
    where: {
      id: productId,
      userId: user.id,
    },
  })
  if (!product) {
    return {
      success: false,
    }
  }

  const parse = productSchema.safeParse(data)
  if (!parse.success) {
    return {
      success: false,
    }
  }
  const productData = parse.data
  await db.product.update({
    where: {
      id: productId,
    },
    data: {
      ...productData,
      price: cleanFormat(productData.price),
      stock: cleanFormat(productData.stock, 0, 100000),
      weight: cleanFormat(productData.weight, 0, 500000),
      length: cleanFormat(productData.length, 0, 1000),
      width: cleanFormat(productData.width, 0, 1000),
      height: cleanFormat(productData.height, 0, 1000),
    },
  })

  return {
    success: true,
  }
}

export const requestApprovalAction = async (data: unknown) => {
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
  if (!user) {
    return {
      success: false,
      message: "Unauthorized",
    }
  }

  await db.product.update({
    where: {
      id: result.data.productId,
      userId: user.id,
    },
    data: {
      approval_status: ProductApprovalStatus.PENDING,
    },
  })

  revalidatePath("/dashboard/products")

  return {
    success: true,
    message: "Product approval requested",
  }
}
