"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { SendHorizontal } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function ManageOrder({ id }: { id: string }) {
  const [open, setOpen] = useState(false)
  const [resi, setResi] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const inputResi = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch("/api/orders/resi", {
        method: "POST",
        body: JSON.stringify({
          id,
          resi,
        }),
      })
      if (!res.ok) throw "Terjadi kesalahan"
      router.refresh()
      setOpen(false)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong.",
        description: error
          ? `${error}`
          : "There was a problem with your request. Please try again.",
        duration: 2000,
      })
    } finally {
      setSubmitting(false)
    }
  }
  return (
    <div className="flex gap-2">
      <Button variant="link">Kendala? chat admin</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Input Resi</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Input Resi</DialogTitle>
          </DialogHeader>
          <form onSubmit={inputResi}>
            <fieldset disabled={submitting}>
              <div className="flex items-center space-x-2 p-6">
                <div className="grid flex-1 gap-2">
                  <Label htmlFor="resi" className="sr-only">
                    No. Resi
                  </Label>
                  <Input
                    id="resi"
                    type="text"
                    placeholder="No. Resi"
                    value={resi}
                    onChange={(e) => setResi(e.target.value)}
                  />
                </div>
                <Button type="submit" size="sm" className="px-3">
                  <span className="sr-only">Copy</span>
                  <SendHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </fieldset>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
