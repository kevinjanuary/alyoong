"use server"

import { db } from "@/lib/prismadb"
import { getCurrentUser } from "@/lib/session"
import { CityResultType, ProvinceResultType, addressSchema } from "@/lib/types"
import { revalidatePath } from "next/cache"

export const primaryAddress = async (id: unknown) => {
  const user = await getCurrentUser()
  if (!user) {
    return {
      success: false,
    }
  }

  const addressId = id as string
  const address = await db.address.findUnique({
    where: {
      id: addressId,
      userId: user.id,
    },
  })
  if (!address) {
    return {
      success: false,
    }
  }

  await db.address.updateMany({
    where: {
      userId: user.id,
    },
    data: {
      primary: false,
    },
  })

  await db.address.update({
    where: {
      id: addressId,
    },
    data: {
      primary: true,
    },
  })

  revalidatePath("/dashboard/address")

  return {
    success: true,
  }
}

export const editAddress = async (id: unknown, data: unknown) => {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    return {
      success: false,
    }
  }

  const addressId = id as string
  const { province, city, province_id, city_id, district } = data as {
    province: string
    city: string
    province_id: string
    city_id: string
    district: string
  }
  const address = await db.address.findUnique({
    where: {
      id: addressId,
      userId: currentUser.id,
    },
  })
  if (!address) {
    return {
      success: false,
    }
  }

  const parse = addressSchema.safeParse(data)
  if (!parse.success) {
    return {
      success: false,
    }
  }

  let getProvince = {
    province_id: province_id,
    province: province,
  }
  if (address.province.toLowerCase() !== province.toLowerCase()) {
    const dataProvince: ProvinceResultType = await fetch(
      `${process.env.BASE_URL}/api/rajaongkir/province`
    ).then((res) => res.json())
    getProvince = dataProvince.rajaongkir.results.find((res) =>
      res.province.toLowerCase().includes(province.toLowerCase())
    ) || {
      province_id: province_id,
      province: province,
    }
  }
  if (!getProvince.province_id || !getProvince.province) {
    return {
      success: false,
    }
  }

  let getCity = {
    city_id: city_id,
    city_name: city,
  }
  if (address.city.toLowerCase() !== city.toLowerCase()) {
    const dataCity: CityResultType = await fetch(
      `http://localhost:3000/api/rajaongkir/city`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          province: getProvince.province_id,
        }),
      }
    ).then((res) => res.json())
    getCity = dataCity.rajaongkir.results.find((res) =>
      res.city_name.toLowerCase().includes(city.toLowerCase())
    ) || {
      city_id: city_id,
      city_name: city,
    }
  }
  if (!getCity.city_id || !getCity.city_name) {
    return {
      success: false,
    }
  }

  const addressData = parse.data

  await db.address.update({
    where: {
      id: address.id,
    },
    data: {
      ...addressData,
      district,
      city_id: getCity.city_id,
      city: getCity.city_name,
      province_id: getProvince.province_id,
      province: getProvince.province,
      userId: currentUser.id,
    },
  })

  return {
    success: true,
  }
}
