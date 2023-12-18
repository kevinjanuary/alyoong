import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const { origin, destination, weight } = await request.json()
  const data = await fetch("https://api.rajaongkir.com/starter/cost", {
    method: "POST",
    headers: {
      key: process.env.RAJAONGKIR_API_KEY as string,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `origin=${origin}&destination=${destination}&weight=${weight}&courier=jne`,
  })
  const result = await data.json()

  if (!data.ok) {
    return NextResponse.json({ status: 400, message: "fail" }, { status: 400 })
  }

  return NextResponse.json(result, { status: 200 })
}
