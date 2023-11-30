import { db } from "@/lib/prismadb"
import bcrypt from "bcrypt"
import { NextResponse } from "next/server"
import { registerSchema } from "@/lib/types"

export async function POST(request: Request) {
  const body = await request.json()
  const { name, email, password } = registerSchema.parse({
    name: body.name,
    email: body.email,
    password: body.password,
  })

  const hashedPassword = await bcrypt.hash(password, 12)

  try {
    await db.user.create({
      data: {
        name,
        email,
        hashedPassword,
      },
    })
    return NextResponse.json({ message: "User created" }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 })
  }
}
