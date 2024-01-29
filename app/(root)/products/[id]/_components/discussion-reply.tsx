"use client"

import { replyDiscussion } from "@/actions/discussion"
import { SubmitAction } from "@/components/submit-action"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { useFormState } from "react-dom"

export const DiscussionReply = ({
  productId,
  currentUserId,
  parentId,
}: {
  productId: string
  currentUserId: string
  parentId: string
}) => {
  const [show, setShow] = useState(false)
  const [message, setMessage] = useState("")
  const data = {
    productId,
    currentUserId,
    parentId,
  }
  const replyAction = replyDiscussion.bind(null, data)
  const [state, formAction] = useFormState(replyAction, null)

  return (
    <div className="space-y-2 mt-2">
      <Button
        variant="outline"
        className="text-xs px-2 h-6"
        onClick={() => setShow(!show)}
      >
        {show ? "Tutup" : "Balas"}
      </Button>
      {show && (
        <form
          action={async (formData) => {
            formAction(formData)
            setMessage("")
            setShow(false)
          }}
          className="w-full space-y-1"
        >
          <Textarea
            placeholder="Balas diskusi ini"
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <p
            className={cn(
              "text-sm font-medium",
              state?.success ? "text-emerald-500" : "text-destructive"
            )}
          >
            {state?.message}
          </p>
          <SubmitAction disabled={message.length < 5} />
        </form>
      )}
    </div>
  )
}
