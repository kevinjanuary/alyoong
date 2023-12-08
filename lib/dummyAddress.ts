export const city = [
  "Jakarta",
  "Bogor",
  "Depok",
  "Tangerang",
  "Bekasi",
  "Bandung",
  "Semarang",
  "Surabaya",
  "Yogyakarta",
  "Malang",
] as const

export type CityDistrictResultType = {
  id: string
  name: string
  country_name: string
  country_code: string
  administrative_division_level_1_name: string
  administrative_division_level_1_type: string
  administrative_division_level_2_name: string
  administrative_division_level_2_type: string
  administrative_division_level_3_name: string
  administrative_division_level_3_type: string
  postal_code?: number
}

export type resultType = {
  status: number
  result: {
    success: boolean
    areas: CityDistrictResultType[]
  }
}

export const firstFetch: resultType = {
  status: 200,
  result: {
    success: true,
    areas: [
      {
        id: "IDNP6IDNC147IDND831",
        name: "Kemayoran, Jakarta Pusat, DKI Jakarta",
        country_name: "Indonesia",
        country_code: "ID",
        administrative_division_level_1_name: "DKI Jakarta",
        administrative_division_level_1_type: "province",
        administrative_division_level_2_name: "Jakarta Pusat",
        administrative_division_level_2_type: "city",
        administrative_division_level_3_name: "Kemayoran",
        administrative_division_level_3_type: "district",
      },
      {
        id: "IDNP6IDNC148IDND838",
        name: "Kebayoran Baru, Jakarta Selatan, DKI Jakarta",
        country_name: "Indonesia",
        country_code: "ID",
        administrative_division_level_1_name: "DKI Jakarta",
        administrative_division_level_1_type: "province",
        administrative_division_level_2_name: "Jakarta Selatan",
        administrative_division_level_2_type: "city",
        administrative_division_level_3_name: "Kebayoran Baru",
        administrative_division_level_3_type: "district",
      },
      {
        id: "IDNP6IDNC148IDND839",
        name: "Kebayoran Lama, Jakarta Selatan, DKI Jakarta",
        country_name: "Indonesia",
        country_code: "ID",
        administrative_division_level_1_name: "DKI Jakarta",
        administrative_division_level_1_type: "province",
        administrative_division_level_2_name: "Jakarta Selatan",
        administrative_division_level_2_type: "city",
        administrative_division_level_3_name: "Kebayoran Lama",
        administrative_division_level_3_type: "district",
      },
    ],
  },
}

export const secondFetch: resultType = {
  status: 200,
  result: {
    success: true,
    areas: [
      {
        id: "IDNP6IDNC147IDND831IDZ10650",
        name: "Kemayoran, Jakarta Pusat, DKI Jakarta. 10650",
        country_name: "Indonesia",
        country_code: "ID",
        administrative_division_level_1_name: "DKI Jakarta",
        administrative_division_level_1_type: "province",
        administrative_division_level_2_name: "Jakarta Pusat",
        administrative_division_level_2_type: "city",
        administrative_division_level_3_name: "Kemayoran",
        administrative_division_level_3_type: "district",
        postal_code: 10650,
      },
      {
        id: "IDNP6IDNC147IDND831IDZ10640",
        name: "Kemayoran, Jakarta Pusat, DKI Jakarta. 10640",
        country_name: "Indonesia",
        country_code: "ID",
        administrative_division_level_1_name: "DKI Jakarta",
        administrative_division_level_1_type: "province",
        administrative_division_level_2_name: "Jakarta Pusat",
        administrative_division_level_2_type: "city",
        administrative_division_level_3_name: "Kemayoran",
        administrative_division_level_3_type: "district",
        postal_code: 10640,
      },
      {
        id: "IDNP6IDNC147IDND831IDZ10620",
        name: "Kemayoran, Jakarta Pusat, DKI Jakarta. 10620",
        country_name: "Indonesia",
        country_code: "ID",
        administrative_division_level_1_name: "DKI Jakarta",
        administrative_division_level_1_type: "province",
        administrative_division_level_2_name: "Jakarta Pusat",
        administrative_division_level_2_type: "city",
        administrative_division_level_3_name: "Kemayoran",
        administrative_division_level_3_type: "district",
        postal_code: 10620,
      },
      {
        id: "IDNP6IDNC147IDND831IDZ10610",
        name: "Kemayoran, Jakarta Pusat, DKI Jakarta. 10610",
        country_name: "Indonesia",
        country_code: "ID",
        administrative_division_level_1_name: "DKI Jakarta",
        administrative_division_level_1_type: "province",
        administrative_division_level_2_name: "Jakarta Pusat",
        administrative_division_level_2_type: "city",
        administrative_division_level_3_name: "Kemayoran",
        administrative_division_level_3_type: "district",
        postal_code: 10610,
      },
      {
        id: "IDNP6IDNC147IDND831IDZ10630",
        name: "Kemayoran, Jakarta Pusat, DKI Jakarta. 10630",
        country_name: "Indonesia",
        country_code: "ID",
        administrative_division_level_1_name: "DKI Jakarta",
        administrative_division_level_1_type: "province",
        administrative_division_level_2_name: "Jakarta Pusat",
        administrative_division_level_2_type: "city",
        administrative_division_level_3_name: "Kemayoran",
        administrative_division_level_3_type: "district",
        postal_code: 10630,
      },
    ],
  },
}
