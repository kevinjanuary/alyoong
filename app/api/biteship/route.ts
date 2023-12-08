import { NextResponse } from "next/server"

export async function GET() {
  try {
    const data = await fetch(
      "https://api.biteship.com/v1/maps/areas?countries=ID&input=Kemayoran&type=double",
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
