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
  name: z.string().min(1, {
    message: "Must be at least 1 character",
  }),
  description: z.string(),
  images: z.string().optional(),
  price: z.number().int().positive(),
  condition: z.string(),
  stock: z.number().int().positive(),
  weight: z.number().int().positive(),
  size: z.string(),
  insurance: z.string(),
  category: z.string(),
  subcategory: z.string().optional().nullable(),
})

export type TProductSchema = z.infer<typeof productSchema>
