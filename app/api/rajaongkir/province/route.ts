import { NextResponse } from "next/server"

export async function GET() {
  const data = await fetch("https://api.rajaongkir.com/starter/province", {
    method: "GET",
    headers: {
      key: process.env.RAJAONGKIR_API_KEY as string,
    },
  })
  const result = await data.json()

  if (!data.ok) {
    return NextResponse.json({ status: 400, message: "fail" }, { status: 400 })
  }

  return NextResponse.json(result, { status: 200 })
}
