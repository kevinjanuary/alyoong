import { cleanFormat } from "@/lib/currencyFormat"
import { db } from "@/lib/prismadb"
import { getCurrentUser } from "@/lib/session"
import { TProductSchema, productSchema } from "@/lib/types"
import { redirect } from "next/navigation"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/login")
  }

  const data: TProductSchema = await request.json()

  try {
    const product = productSchema.parse({
      name: data.name,
      description: data.description,
      images: data.images,
      price: data.price,
      condition: data.condition,
      stock: data.stock,
      weight: data.weight,
      length: data.length,
      width: data.width,
      height: data.height,
      warranty: data.warranty,
      warranty_detail: data.warranty_detail,
      category: data.category,
      subcategory: data.subcategory,
    })

    await db.product.create({
      data: {
        ...product,
        price: cleanFormat(product.price),
        stock: cleanFormat(product.stock, 0, 100000),
        weight: cleanFormat(product.weight, 0, 500000),
        length: cleanFormat(product.length, 0, 1000),
        width: cleanFormat(product.width, 0, 1000),
        height: cleanFormat(product.height, 0, 1000),
        userId: currentUser.id,
      },
    })

    return NextResponse.json({ message: "Product created" }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 })
  }
}
