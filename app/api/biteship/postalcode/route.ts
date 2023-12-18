import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const { areaId } = await request.json()
  try {
    const data = await fetch(
      `https://api.biteship.com/v1/maps/areas/${areaId}`,
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
          authorization: process.env.BITESHIP_API_KEY as string,
        },
      }
    )
    const result = await data.json()

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    return NextResponse.json({ status: 500, error }, { status: 500 })
  }
}
