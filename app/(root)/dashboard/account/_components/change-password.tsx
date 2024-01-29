"use client"

import { changePassword } from "@/actions/account"
import { InputPassword } from "@/components/InputPassword"
import { SubmitButton } from "@/components/submit-button"
import { Label } from "@/components/ui/label"
import { useState } from "react"

const ChangePasswordForm = () => {
  const [oldpassword, setOldPassword] = useState("")
  const [newpassword, setNewPassword] = useState("")
  const [newpassword2, setNewPassword2] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const res = await changePassword({
      oldpassword: oldpassword.trim(),
      newpassword: newpassword.trim(),
      newpassword2: newpassword2.trim(),
    })

    setSuccess("")
    setOldPassword("")
    setNewPassword("")
    setNewPassword2("")
    setLoading(false)
    if (res.error) {
      setError(res.error)
    }
    if (res.success) {
      setSuccess("Kata sandi berhasil diubah")
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 border p-4 rounded-lg">
      <h2 className="font-semibold text-2xl">Ubah kata sandi</h2>
      <div>
        <Label htmlFor="oldpassword">Kata sandi lama</Label>
        <InputPassword
          id="oldpassword"
          value={oldpassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="newpassword">Kata sandi baru</Label>
        <InputPassword
          id="newpassword"
          value={newpassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="newpassword2">Ulangi kata sandi baru</Label>
        <InputPassword
          id="newpassword2"
          value={newpassword2}
          onChange={(e) => setNewPassword2(e.target.value)}
        />
      </div>
      {error && (
        <p className="text-destructive bg-destructive/20 py-3 px-4 rounded-md text-sm">
          {error}
        </p>
      )}
      {success && (
        <p className="text-emerald-600 bg-emerald-600/20 py-3 px-4 rounded-md text-sm">
          {success}
        </p>
      )}
      <SubmitButton
        submit={loading}
        text="Ubah"
        disabled={
          oldpassword.trim().length < 8 ||
          newpassword.trim().length < 8 ||
          newpassword2.trim().length < 8
        }
      />
    </form>
  )
}

export default ChangePasswordForm
