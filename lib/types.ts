import { z } from "zod"

export const registerSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters long",
    })
    .max(100)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/, {
      message:
        "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character",
    }),
})

export type TRegisterSchema = z.infer<typeof registerSchema>

export const loginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters long",
    })
    .max(100),
})

export type TLoginSchema = z.infer<typeof loginSchema>

export const productSchema = z.object({
  name: z
    .string()
    .min(10, {
      message: "Product name must be at least 10 characters long",
    })
    .max(200, {
      message: "Product name must be at most 200 characters long",
    }),
  description: z.string().max(2000, {
    message: "Product description must be at most 2000 characters long",
  }),
  images: z.string(),
  price: z
    .string()
    .min(3, {
      message: "Minimum product price is Rp 100",
    })
    .max(11, {
      message: "Maximum product price is Rp 999.999.999",
    }),
  condition: z.enum([
    "Very good condition",
    "Good condition",
    "Judge by picture",
  ]),
  stock: z
    .string()
    .regex(/[^0]/g, {
      message: "Minimum product stock is 0",
    })
    .min(1, {
      message: "Minimum product stock is 0",
    })
    .max(7, {
      message: "Maximum product stock is 100.000",
    }),
  weight: z
    .string()
    .regex(/[^0]/g, {
      message: "Minimum product stock is 0",
    })
    .min(1, {
      message: "Minimum product weight is 1 grams",
    })
    .max(8, {
      message: "Maximum product weight is 500.000 grams",
    }),
  length: z
    .string()
    .regex(/[^0]/g, {
      message: "Minimum product stock is 0",
    })
    .min(1, {
      message: "Min. 1 cm",
    })
    .max(5, {
      message: "Max. 1000 cm",
    }),
  width: z
    .string()
    .regex(/[^0]/g, {
      message: "Minimum product stock is 0",
    })
    .min(1, {
      message: "Min. 1 cm",
    })
    .max(5, {
      message: "Max. 1000 cm",
    }),
  height: z
    .string()
    .regex(/[^0]/g, {
      message: "Minimum product stock is 0",
    })
    .min(1, {
      message: "Min. 1 cm",
    })
    .max(5, {
      message: "Max. 1000 cm",
    }),
  warranty: z.enum(["Active", "No"]),
  warranty_detail: z.coerce
    .number()
    .int()
    .gt(0, {
      message: "Must at least 1 month",
    })
    .lte(999, {
      message: "Max. 50 characters",
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
      message: "Label must be filled",
    })
    .max(30, {
      message: "Label must be at most 30 characters long",
    }),
  name: z
    .string()
    .min(2, {
      message: "Name must be filled",
    })
    .max(50, {
      message: "Name must be at most 50 characters long",
    }),
  phone: z
    .string()
    .min(9, {
      message: "Phone number must be at least 9 characters long",
    })
    .max(20, {
      message: "Phone number must be at most 20 characters long",
    }),
  city_district: z
    .string()
    .min(3, {
      message: "City/District must be at least 3 character long",
    })
    .max(100),
  postal_code: z.string().length(5, {
    message: "Postal code must be 5 characters long",
  }),
  address: z
    .string()
    .min(5, {
      message: "Address must be filled",
    })
    .max(200, {
      message: "Address must be at most 200 characters long",
    }),
  notes: z
    .string()
    .max(50, {
      message: "Notes must be at most 50 characters long",
    })
    .optional()
    .nullable(),
})

export type TAddressSchema = z.infer<typeof addressSchema>

export type TAddressFullSchema = TAddressSchema & {
  province: string
  city: string
  district: string
}
