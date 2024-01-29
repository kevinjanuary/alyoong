"use server"

import { db } from "@/lib/prismadb"
import { DiscussionSchema, discussionSchema } from "@/lib/types"
import { revalidatePath } from "next/cache"

type Discussion = {
  productId: string
  currentUserId: string
}

export const addDiscussion = async (data: unknown) => {
  const { productId, currentUserId } = data as Discussion
  const parse = discussionSchema.safeParse(data)

  if (!parse.success) {
    return {
      success: false,
    }
  }

  const currentUser = await db.user.findUnique({
    where: {
      id: currentUserId,
    },
  })

  if (!currentUser) {
    return {
      success: false,
    }
  }

  await db.comment.create({
    data: {
      comment: parse.data.message,
      productId,
      userId: currentUser.id,
    },
  })

  revalidatePath(`/products/${productId}`)

  return {
    success: true,
  }
}

type ReplyDiscussion = Discussion & {
  parentId: string
}

export const replyDiscussion = async (
  data: unknown,
  prevState: unknown,
  formData: FormData
) => {
  const { productId, currentUserId, parentId } = data as ReplyDiscussion
  const parse = discussionSchema.safeParse(
    Object.fromEntries(formData.entries())
  )

  if (!parse.success) {
    return {
      success: false,
      message: "Reply failed",
    }
  }

  const currentUser = await db.user.findUnique({
    where: {
      id: currentUserId,
    },
  })

  if (!currentUser) {
    return {
      success: false,
      message: "Please login first",
    }
  }

  await db.comment.create({
    data: {
      comment: parse.data.message,
      productId,
      userId: currentUser.id,
      parentId,
    },
  })

  revalidatePath(`/products/${productId}`)

  return {
    success: true,
    message: "Reply success",
  }
}
