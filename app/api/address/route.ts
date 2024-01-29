import { NextRequest, NextResponse } from "next/server"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/session"
import { db } from "@/lib/prismadb"
import {
  TAddressFullSchema,
  addressSchema,
  CityResultType,
  ProvinceResultType,
} from "@/lib/types"

export async function GET(request: NextRequest) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return redirect("/login")
  }

  const addresses = await db.address.findMany({
    where: {
      userId: currentUser.id,
    },
    orderBy: {
      primary: "desc",
    },
  })

  return NextResponse.json(addresses, { status: 200 })
}

export async function POST(request: NextRequest) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/login")
  }

  try {
    const data: TAddressFullSchema = await request.json()
    const address = addressSchema.parse({
      label: data.label,
      name: data.name,
      phone: data.phone,
      city_district: data.city_district,
      postal_code: data.postal_code,
      address: data.address,
      notes: data.notes,
    })

    const addresses = await db.address.findMany({
      where: {
        userId: currentUser.id,
      },
    })
    if (addresses.length >= 3) {
      return NextResponse.json(
        { status: 400, message: "You can only have 3 addresses" },
        { status: 400 }
      )
    }

    const hasPrimary = addresses.some((address) => address.primary)

    const resProvince = await fetch(
      `${process.env.BASE_URL}/api/rajaongkir/province`
    )
    const dataProvince: ProvinceResultType = await resProvince.json()
    const getProvince = dataProvince.rajaongkir.results.find((res) =>
      res.province.toLowerCase().includes(data.province.toLowerCase())
    )
    if (!resProvince.ok || !getProvince) throw "No Province"

    const resCity = await fetch(`http://localhost:3000/api/rajaongkir/city`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        province: getProvince.province_id,
      }),
    })
    const dataCity: CityResultType = await resCity.json()
    const getCity = dataCity.rajaongkir.results.find((res) =>
      res.city_name.toLowerCase().includes(data.city.toLowerCase())
    )
    if (!resCity.ok || !getCity) throw "No City"

    await db.address.create({
      data: {
        ...address,
        district: data.district,
        city_id: getCity.city_id,
        city: data.city,
        province_id: getProvince.province_id,
        province: data.province,
        userId: currentUser.id,
        primary: !hasPrimary,
      },
    })

    return NextResponse.json(
      { status: 201, message: "Address created" },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json({ status: 400, error }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return redirect("/login")
  }

  const { id } = await request.json()

  try {
    await db.address.delete({
      where: {
        id,
        userId: currentUser.id,
      },
    })

    return NextResponse.json(
      { status: 200, message: "Address deleted" },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json({ status: 400, error }, { status: 400 })
  }
}
