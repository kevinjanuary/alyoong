import { z } from "zod"

export const registerSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email({
    message: "Masukkan alamat email yang valid",
  }),
  password: z
    .string()
    .min(8, {
      message: "Password harus terdiri dari minimal 8 karakter",
    })
    .max(100)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/, {
      message:
        "Password harus terdiri dari minimal 8 karakter, 1 huruf besar, 1 huruf kecil, 1 angka, dan 1 karakter spesial",
    }),
})

export type TRegisterSchema = z.infer<typeof registerSchema>

export const loginSchema = z.object({
  email: z.string().email({
    message: "Masukkan alamat email yang valid",
  }),
  password: z
    .string()
    .min(8, {
      message: "Password harus terdiri dari minimal 8 karakter",
    })
    .max(100),
})

export type TLoginSchema = z.infer<typeof loginSchema>

export const productSchema = z.object({
  name: z
    .string()
    .min(10, {
      message: "Nama produk harus terdiri dari minimal 10 karakter",
    })
    .max(200, {
      message: "Nama produk harus terdiri dari maksimal 200 karakter",
    }),
  description: z.string().max(2000, {
    message: "Deskripsi produk harus terdiri dari maksimal 2000 karakter",
  }),
  images: z.string(),
  price: z
    .string()
    .min(3, {
      message: "Harga minimal Rp 100",
    })
    .max(11, {
      message: "Harga maksimal Rp 999.999.999",
    }),
  condition: z.enum([
    "Very good condition",
    "Good condition",
    "Judge by picture",
  ]),
  stock: z
    .string()
    .regex(/[^0]/g, {
      message: "Stok minimal 0",
    })
    .min(1, {
      message: "Stok minimal 0",
    })
    .max(7, {
      message: "Stok maksimal 999.999",
    }),
  weight: z
    .string()
    .regex(/[^0]/g, {
      message: "Berat minimal 1 gram",
    })
    .min(1, {
      message: "Berat minimal 1 gram",
    })
    .max(8, {
      message: "Berat maksimal 999.999 gram",
    }),
  length: z
    .string()
    .regex(/[^0]/g, {
      message: "Panjang minimal 1 cm",
    })
    .min(1, {
      message: "Panjang minimal 1 cm",
    })
    .max(5, {
      message: "Panjang maksimal 1000 cm",
    }),
  width: z
    .string()
    .regex(/[^0]/g, {
      message: "Lebar minimal 1 cm",
    })
    .min(1, {
      message: "Lebar minimal 1 cm",
    })
    .max(5, {
      message: "Lebar maksimal 1000 cm",
    }),
  height: z
    .string()
    .regex(/[^0]/g, {
      message: "Tinggi minimal 1 cm",
    })
    .min(1, {
      message: "Tinggi minimal 1 cm",
    })
    .max(5, {
      message: "Tinggi maksimal 1000 cm",
    }),
  warranty: z.enum(["Active", "No"]),
  warranty_detail: z.coerce
    .number()
    .int()
    .gt(0, {
      message: "Minimal 1 bulan",
    })
    .lte(999, {
      message: "Maksimal 999 bulan",
    })
    .default(0),
  category: z.enum([
    "Monitor",
    "Keyboard",
    "Mouse",
    "Headset",
    "Webcam",
    "Processor",
    "Motherboard",
    "Graphic Card",
    "Power Supply",
    "Memory",
    "Disk",
    "Other",
  ]),
  subcategory: z.string().max(50).optional().nullable(),
})

export type TProductSchema = z.infer<typeof productSchema>

export const addressSchema = z.object({
  label: z
    .string()
    .min(1, {
      message: "Label harus diisi",
    })
    .max(30, {
      message: "Label maksimal 30 karakter",
    }),
  name: z
    .string()
    .min(2, {
      message: "Nama harus diisi",
    })
    .max(50, {
      message: "Nama maksimal 50 karakter",
    }),
  phone: z
    .string()
    .min(9, {
      message: "Nomor telepon harus diisi",
    })
    .max(20, {
      message: "Nomor telepon maksimal 20 karakter",
    }),
  city_district: z
    .string()
    .min(3, {
      message: "Kota/Kabupaten harus diisi",
    })
    .max(100),
  postal_code: z.string().length(5, {
    message: "Kode pos harus terdiri dari 5 angka",
  }),
  address: z
    .string()
    .min(5, {
      message: "Alamat lengkap harus diisi",
    })
    .max(200, {
      message: "Alamat lengkap maksimal 200 karakter",
    }),
  notes: z
    .string()
    .max(50, {
      message: "Catatan maksimal 50 karakter",
    })
    .optional()
    .nullable(),
})

export type TAddressSchema = z.infer<typeof addressSchema>

export const discussionSchema = z.object({
  message: z
    .string()
    .min(1, {
      message: "Tulis pertanyaanmu terlebih dahulu",
    })
    .max(2000, {
      message: "Pertanyaanmu terlalu panjang. Maksimal 2000 karakter",
    }),
})

export type DiscussionSchema = z.infer<typeof discussionSchema>

export type TAddressFullSchema = TAddressSchema & {
  province: string
  city: string
  district: string
}

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
  success: boolean
  areas: CityDistrictResultType[]
}

export type ProvinceResultType = {
  rajaongkir: {
    query: never[]
    status: {
      code: number
      description: string
    }
    results: {
      province_id: string
      province: string
    }[]
  }
}

export type CityType = {
  city_id: string
  province_id: string
  province: string
  type: string
  city_name: string
  postal_code: string
}

export type CityResultType = {
  rajaongkir: {
    query: {
      province: string
    }
    status: {
      code: number
      description: string
    }
    results: CityType[]
  }
}

export type CostsType = {
  service: string
  description: string
  cost: CostType[]
}

export type CostType = {
  value: number
  etd: string
  note: string
}

export type CostResultType = {
  rajaongkir: {
    query: {
      origin: string
      destination: string
      weight: number
      courier: string
    }
    status: {
      code: number
      description: string
    }
    origin_details: CityType
    destination_details: CityType
    results: {
      code: string
      name: string
      costs: CostsType[]
    }[]
  }
}
