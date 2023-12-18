import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const data = await fetch(
      "https://api.biteship.com/v1/maps/areas?countries=ID&input=Gunung+Kidul&type=double",
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
          authorization: process.env.BITESHIP_API_KEY as string,
        },
      }
    )
    const result = await data.json()

    return NextResponse.json({ status: 200, result }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ status: 500, error }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const { query } = await request.json()
  try {
    const data = await fetch(
      `https://api.biteship.com/v1/maps/areas?countries=ID&input=${query}&type=double`,
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
