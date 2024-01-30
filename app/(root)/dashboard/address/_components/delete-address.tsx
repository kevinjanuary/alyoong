"use client"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function DeleteAddress({ id }: { id: string }) {
  const [open, setOpen] = useState(false)
  const [submit, setSubmit] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleDelete = async () => {
    setSubmit(true)
    try {
      const res = await fetch("/api/address", {
        method: "DELETE",
        body: JSON.stringify({ id }),
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!res.ok) throw "Add address failed. Please try again."

      toast({
        title: "Address has been deleted!",
        description: "Successfully deleted address.",
        duration: 2000,
      })

      router.refresh()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong.",
        description: error
          ? `${error}`
          : "There was a problem with your request. Please try again.",
        duration: 2000,
      })
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="destructive">
          Hapus
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus alamat ini?</AlertDialogTitle>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Alamat yang sudah dihapus tidak dapat dikembalikan. Pastikan Anda
              yakin ingin menghapus alamat ini. Anda dapat menambahkan alamat
              baru kapan saja.
            </AlertDescription>
          </Alert>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <fieldset disabled={submit} className="group">
            <div className="flex gap-2">
              <AlertDialogCancel>Batal</AlertDialogCancel>
              {submit ? (
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mohon tunggu ya...
                </Button>
              ) : (
                <Button variant="destructive" onClick={handleDelete}>
                  Hapus alamat
                </Button>
              )}
            </div>
          </fieldset>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
