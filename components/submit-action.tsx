"use client"

import { Loader2 } from "lucide-react"
import { Button } from "./ui/button"
import { useFormStatus } from "react-dom"

export function SubmitAction({
  text,
  className,
  disabled,
}: {
  text?: string
  className?: string
  disabled?: boolean
}) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" className={className} disabled={pending || disabled}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Please wait
        </>
      ) : (
        text || "Submit"
      )}
    </Button>
  )
}
