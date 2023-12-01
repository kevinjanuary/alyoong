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
    .min(1, {
      message: "Must be at least 1 character",
    })
    .max(200, {
      message: "Max 200 character",
    }),
  description: z.string(),
  images: z.string().optional(),
  price: z.coerce.number().int().positive().gt(0),
  condition: z.enum([
    "Very good condition",
    "Good condition",
    "Judge by picture",
  ]),
  stock: z.coerce.number().int().positive().gte(0),
  weight: z.coerce.number().int().positive().gt(0),
  size: z.string(),
  warranty: z.string(),
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
  subcategory: z.string().optional().nullable(),
})

export type TProductSchema = z.infer<typeof productSchema>
