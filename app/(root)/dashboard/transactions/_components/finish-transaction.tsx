"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

import { AlertCircle, Loader2 } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import { useRouter } from "next/navigation"
import { useState } from "react"

export function FinishTransaction({ id }: { id: string }) {
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  const finishTransaction = async () => {
    setSubmitting(true)
    try {
      const res = await fetch("/api/transactions/finish", {
        method: "POST",
        body: JSON.stringify({
          id,
        }),
      })
      if (!res.ok) throw "Terjadi kesalahan"

      router.refresh()
      setOpen(false)
    } catch (error) {
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button>Selesaikan pesanan</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Selesaikan pesanan?</AlertDialogTitle>
          <AlertDialogDescription>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Peringatan!</AlertTitle>
              <AlertDescription>
                Pesanan akan selesai dan tidak dapat diubah lagi. Harap pastikan
                Anda telah menerima pesanan.
              </AlertDescription>
            </Alert>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {submitting ? (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button onClick={finishTransaction}>Selesaikan pesanan</Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
