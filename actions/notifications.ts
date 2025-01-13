"use server"

import { db } from "@/lib/prismadb"
import { getCurrentUser } from "@/lib/session"
import { redirect } from "next/navigation"
import { z } from "zod"

export const readNotificationAction = async (data: unknown) => {
  const result = z
    .object({
      notificationId: z.number().int().gte(1),
    })
    .safeParse(data)

  if (!result.success) {
    return {
      success: false,
      message: "Invalid data",
    }
  }

  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
  }

  await db.notification.update({
    where: {
      id: result.data.notificationId,
    },
    data: {
      read: true,
    },
  })

  return {
    success: true,
    message: "Notification marked as read",
  }
}
