"use server"

import { db } from "@/lib/prismadb"
import { getCurrentUser } from "@/lib/session"
import { revalidatePath } from "next/cache"
import bcrypt from "bcrypt"
import { join } from "path"
import { mkdir, writeFile } from "fs/promises"

export const removePhoto = async () => {
  const user = await getCurrentUser()
  if (!user) {
    return {
      success: false,
    }
  }

  const dir = join(process.cwd(), "public", "uploads")
  const path = join(dir, `${user.id}.png`)
  await writeFile(path, "")

  await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      image: null,
    },
  })

  revalidatePath("/dashboard/account")

  return {
    success: true,
  }
}

export const changePhoto = async (data: FormData) => {
  const user = await getCurrentUser()
  if (!user) {
    return {
      success: false,
    }
  }

  const file: File | null = data.get("file") as unknown as File
  if (!file) {
    throw new Error("No file")
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const dir = join(process.cwd(), "public", "uploads")
  await mkdir(dir, { recursive: true })

  const path = join(dir, `${user.id}.png`)
  await writeFile(path, buffer)

  await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      image: `/uploads/${user.id}.png`,
    },
  })

  revalidatePath("/dashboard/account")

  return {
    success: true,
  }
}

export const changeName = async (data: unknown) => {
  const user = await getCurrentUser()
  if (!user) {
    return {
      success: false,
    }
  }

  const { name } = data as { name: string }

  await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      name,
    },
  })

  revalidatePath("/dashboard/account")

  return {
    success: true,
  }
}

export const changePassword = async (data: unknown) => {
  const user = await getCurrentUser()
  if (!user) {
    return {
      success: false,
    }
  }

  const { oldpassword, newpassword, newpassword2 } = data as {
    oldpassword: string
    newpassword: string
    newpassword2: string
  }

  const isMatch = await bcrypt.compare(oldpassword, user.hashedPassword || "")
  if (!isMatch) {
    return {
      success: false,
      error: "Kata sandi lama salah",
    }
  }
  if (newpassword !== newpassword2) {
    return {
      success: false,
      error: "Kata sandi baru tidak cocok",
    }
  }

  const hashedPassword = await bcrypt.hash(newpassword, 12)

  await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      hashedPassword,
    },
  })

  return {
    success: true,
  }
}
