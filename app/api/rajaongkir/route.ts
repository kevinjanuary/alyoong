import { NextResponse } from "next/server"

export async function GET() {
  const data = await fetch("https://api.rajaongkir.com/starter/cost", {
    method: "POST",
    headers: {
      key: process.env.RAJAONGKIR_API_KEY as string,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "origin=154&destination=152&weight=2000&courier=jne",
  })
  const result = await data.json()

  return NextResponse.json({ status: 200, result }, { status: 200 })
}
