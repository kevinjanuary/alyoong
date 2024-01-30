"use client"

import {
  AlertDialog,
  AlertDialogAction,
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
import { deleteProduct } from "@/actions/product"
import { useToast } from "@/components/ui/use-toast"
import { useState } from "react"

const DeleteProduct = ({
  productId,
  setOpen,
}: {
  productId: string
  setOpen: (state: boolean) => void
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  return (
    <AlertDialog onOpenChange={(e) => setOpen(e)}>
      <AlertDialogTrigger asChild>
        <span className="text-destructive">Hapus produk</span>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Yakin hapus produk ini?</AlertDialogTitle>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Produk ini akan dihapus permanen dan tidak bisa dikembalikan.
              Apakah kamu yakin?
            </AlertDescription>
          </Alert>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={isLoading}
            onClick={async () => {
              setIsLoading(true)
              setOpen(false)
              const result = await deleteProduct(productId)
              console.log(result)
              toast({
                title: result.success
                  ? "Berhasil menghapus produk!"
                  : "Gagal menghapus produk!",
              })
              setIsLoading(false)
            }}
          >
            {isLoading ? "Menghapus..." : "Hapus produk"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteProduct
