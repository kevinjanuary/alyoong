"use client"

import { addReviewAction } from "@/actions/review"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

import { Loader2, StarIcon } from "lucide-react"

import { useRouter } from "next/navigation"
import { useState } from "react"

export function AddProductReview({ transactionId }: { transactionId: string }) {
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  const [stars, setStars] = useState(5)
  const [review, setReview] = useState("")

  const addReview = async () => {
    setSubmitting(true)

    try {
      await addReviewAction({ transactionId, stars, review })

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
        <Button>Beri ulasan</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Beri ulasan</AlertDialogTitle>
          <AlertDialogDescription>
            Beri ulasan untuk penjual dan produk yang sudah kamu beli agar
            pengguna lain bisa tahu pengalaman kamu.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-2 text-sm">
          <Label>Bagaimana kualitas produk ini secara keseluruhan?</Label>
          <div className="flex items-center gap-4 !mb-4">
            <div className="flex flex-row-reverse items-center gap-0 group/stars">
              {[5, 4, 3, 2, 1].map((starValue) => (
                <StarIcon
                  key={starValue}
                  className={cn(
                    starValue <= stars &&
                      "!fill-amber-300 !stroke-amber-300 group-hover/stars:fill-transparent",
                    "w-7 h-6 cursor-pointer peer peer-hover:stroke-amber-300 peer-hover:fill-amber-300 hover:!fill-amber-300 hover:!stroke-amber-300 pr-1 first:p-0 first:w-6 fill-gray-200 stroke-gray-200"
                  )}
                  onClick={() => setStars(starValue)}
                />
              ))}
            </div>

            <span>
              {stars === 1
                ? "Sangat buruk"
                : stars === 2
                ? "Buruk"
                : stars === 3
                ? "Cukup"
                : stars === 4
                ? "Baik"
                : "Sangat baik"}
            </span>
          </div>

          <Label htmlFor="review">
            {stars === 1
              ? "Apa yang membuat Anda kecewa?"
              : stars === 2
              ? "Apa yang membuat Anda tidak puas?"
              : stars === 3
              ? "Apa yang membuat Anda kurang puas?"
              : "Apa yang membuat Anda puas?"}
          </Label>
          <Textarea
            id="review"
            className="!min-h-24"
            placeholder="Tulis ulasan Anda..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          {submitting ? (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button onClick={addReview}>Kirim</Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
