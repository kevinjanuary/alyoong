import { NextRequest, NextResponse } from "next/server"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/session"
import { db } from "@/lib/prismadb"
import { TAddressFullSchema, addressSchema } from "@/lib/types"

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

  const data: TAddressFullSchema = await request.json()

  try {
    const address = addressSchema.parse({
      label: data.label,
      name: data.name,
      phone: data.phone,
      city_district: data.city_district,
      postal_code: data.postal_code,
      address: data.address,
      notes: data.notes,
    })

    await db.address.create({
      data: {
        ...address,
        district: data.district,
        city: data.city,
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

export async function PUT(request: NextRequest) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/login")
  }

  const data: TAddressFullSchema & { id: string } = await request.json()

  try {
    const address = addressSchema.parse({
      label: data.label,
      name: data.name,
      phone: data.phone,
      city_district: data.city_district,
      postal_code: data.postal_code,
      address: data.address,
      notes: data.notes,
    })

    await db.address.update({
      where: {
        id: data.id,
      },
      data: {
        ...address,
        district: data.district,
        city: data.city,
        province: data.province,
      },
    })

    return NextResponse.json(
      { status: 200, message: "Address updated" },
      { status: 200 }
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
