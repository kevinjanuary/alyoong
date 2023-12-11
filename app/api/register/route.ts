import { db } from "@/lib/prismadb"
import bcrypt from "bcrypt"
import { NextResponse } from "next/server"
import { registerSchema } from "@/lib/types"

export async function POST(request: Request) {
  const data = await request.json()

  try {
    const { name, email, password } = registerSchema.parse(data)

    const hashedPassword = await bcrypt.hash(password, 12)

    await db.user.create({
      data: {
        name,
        email,
        hashedPassword,
      },
    })
    return NextResponse.json({ message: "User created" }, { status: 201 })
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { field: "email", message: "A user with this email already exists." },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { field: "general", message: "An unknown error occurred." },
      { status: 400 }
    )
  }
}
