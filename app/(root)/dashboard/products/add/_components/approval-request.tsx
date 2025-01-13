"use client"

import { requestApprovalAction } from "@/actions/product"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export const ApprovalRequest = ({ productId }: { productId: string }) => {
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    setSubmitting(true)
    await requestApprovalAction({ productId })
    setSubmitting(false)
  }

  return (
    <Button
      size="sm"
      className="w-full"
      onClick={handleSubmit}
      disabled={submitting}
    >
      {submitting ? "Submitting..." : "Request approval"}
    </Button>
  )
}
