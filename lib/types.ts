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
