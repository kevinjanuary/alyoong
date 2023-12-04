import { getCurrentUser } from "@/lib/session"
import { mkdir, writeFile } from "fs/promises"
import { redirect } from "next/navigation"
import { NextRequest, NextResponse } from "next/server"
import path, { join } from "path"

export async function POST(request: NextRequest) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/login")
  }

  const data = await request.formData()
  const file: File | null = data.get("image") as unknown as File

  if (!file) {
    return NextResponse.json({ success: false }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const pathname = join("upload/images", currentUser.id.toString())
  const dirPath = join(process.cwd(), "public", pathname)
  await mkdir(dirPath, { recursive: true })
  const fileName = `${Date.now()}${Math.round(
    Math.random() * 1e5
  )}${path.extname(file.name)}`
  const imageSrc = `/${pathname.replace(/\\/g, "/")}/${fileName}`

  try {
    await writeFile(`${dirPath}/${fileName}`, buffer)

    return NextResponse.json(
      { success: true, images: imageSrc },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 })
  }
}
