"use client"

import { changeName } from "@/actions/account"
import { SubmitButton } from "@/components/submit-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User } from "@prisma/client"
import { useState } from "react"

const ChangeNameForm = ({ user }: { user: User }) => {
  const [name, setName] = useState(user.name)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const res = await changeName({ name: name.trim() })
    setSuccess("")
    setLoading(false)
    if (res.success) {
      setSuccess("Nama berhasil diubah")
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 border p-4 rounded-lg">
      <div>
        <Label htmlFor="email">Alamat email</Label>
        <Input
          type="email"
          id="email"
          placeholder="Alamat email"
          defaultValue={user.email}
          disabled
        />
      </div>
      <div>
        <Label htmlFor="name">Nama lengkap</Label>
        <Input
          name="name"
          type="name"
          id="name"
          placeholder="Nama lengkap"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      {success && (
        <p className="text-emerald-600 bg-emerald-600/20 py-3 px-4 rounded-md text-sm">
          {success}
        </p>
      )}
      <SubmitButton
        submit={loading}
        text="Ubah"
        disabled={
          name.trim().length < 3 ||
          name.trim().length > 50 ||
          user.name === name.trim()
        }
      />
    </form>
  )
}

export default ChangeNameForm
