import { db } from "@/lib/prismadb"
import bcrypt from "bcrypt"
import { NextResponse } from "next/server"
import { registerSchema } from "@/lib/types"

export async function POST(request: Request) {
  const data = await request.json()

  try {
    const { name, email, password } = registerSchema.parse({
      name: data.name,
      email: data.email,
      password: data.password,
    })

    const hashedPassword = await bcrypt.hash(password, 12)

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
