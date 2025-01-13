"use client"

import {
  approveProductAction,
  rejectProductAction,
} from "@/actions/admin.products"
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
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

export const ApproveProduct = ({ productId }: { productId: string }) => {
  const [submitting, setSubmitting] = useState(false)

  const handleApprove = async () => {
    setSubmitting(true)
    await approveProductAction({ productId })
    setSubmitting(false)
  }

  return (
    <Button
      size="sm"
      className="bg-green-500 hover:bg-green-500/90"
      onClick={handleApprove}
      disabled={submitting}
    >
      {submitting ? "Approving..." : "Approve"}
    </Button>
  )
}

export const RejectProduct = ({ productId }: { productId: string }) => {
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [reason, setReason] = useState("")

  const handleReject = async () => {
    setSubmitting(true)
    await rejectProductAction({ productId, reason })
    setSubmitting(false)

    setOpen(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="destructive">
          Reject
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reject Product</AlertDialogTitle>
          <AlertDialogDescription>
            Please provide a reason for rejecting the product
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Textarea
          className="w-full p-2 border rounded-md"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason"
        />

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleReject}
            disabled={submitting || !reason.trim()}
          >
            {submitting ? "Rejecting..." : "Reject"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
