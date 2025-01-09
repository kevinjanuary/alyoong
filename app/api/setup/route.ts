import { db } from "@/lib/prismadb"
import { NextResponse } from "next/server"

export const GET = async (req: Request, res: Response) => {
  // change user images url from /uploads/xxx to /uploads/users/xxx
  const users = await db.user.findMany({
    where: {
      image: {
        not: null,
      },
    },
  })

  const usersWithImages = users.filter((user) => user.image !== null)

  const updated = users.map((user) => {
    if (
      !user.image?.startsWith("/uploads/") ||
      user.image?.startsWith("/uploads/users/")
    ) {
      return null
    }

    return db.user.update({
      where: { id: user.id },
      data: {
        image: user.image.replace("/uploads/", "/uploads/users/"),
      },
    })
  })

  await db.$transaction(updated.filter((u) => u !== null))

  // change product images from /upload/images to /uploads/products
  const products = await db.product.findMany()

  const updatedProducts = products.map((product) => {
    if (
      !product.images.startsWith("/upload/images/") ||
      product.images.startsWith("/uploads/products/")
    ) {
      return null
    }

    return db.product.update({
      where: { id: product.id },
      data: {
        images: product.images.replace("/upload/images/", "/uploads/products/"),
      },
    })
  })

  await db.$transaction(updatedProducts.filter((p) => p !== null))

  return NextResponse.json({
    status: "success",
  })
}
