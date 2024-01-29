"use client"

import { changePhoto, removePhoto } from "@/actions/account"
import { Button } from "@/components/ui/button"
import { useRef, useState } from "react"

const ChangeImagesForm = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [success, setSuccess] = useState("")

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files && event.target.files[0]
    if (!file) return

    try {
      const data = new FormData()
      data.set("file", file)

      const res = await changePhoto(data)
      if (!res.success) throw "Failed to upload photo"
      setSuccess("Foto berhasil diunggah")
    } catch (error) {}
  }

  return (
    <div className="flex flex-col space-y-4 mt-4">
      <Button
        onClick={async () => {
          const res = await removePhoto()
          if (res.success) setSuccess("Foto berhasil dihapus")
        }}
      >
        Hapus foto
      </Button>
      <Button onClick={handleUploadClick}>
        Unggah foto...
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
      </Button>
      {success && (
        <p className="text-emerald-600 bg-emerald-600/20 py-3 px-4 rounded-md text-sm">
          {success}
        </p>
      )}
    </div>
  )
}

export default ChangeImagesForm
