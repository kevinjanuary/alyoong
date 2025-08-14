import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { origin, destination, weight } = await request.json()
    const data = await fetch(
      `https://rajaongkir.komerce.id/api/v1/calculate/domestic-cost`,
      {
        method: "POST",
        headers: {
          key: process.env.RAJAONGKIR_API_KEY as string,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `origin=${origin}&destination=${destination}&weight=${weight}&courier=jne`,
      }
    )
    const result = await data.json()

    if (!data.ok) {
      console.log("ERROR", data)
      return NextResponse.json(
        { status: 400, message: "fail" },
        { status: 400 }
      )
    }

    return NextResponse.json(result.data, { status: 200 })
  } catch (error) {
    console.log("ERROR", error)
    return NextResponse.json({ status: 500, error }, { status: 500 })
  }
}
