import { Loader2 } from "lucide-react"
import { Button } from "./ui/button"

export function SubmitButton({
  submit,
  text,
  className,
}: {
  submit: boolean
  text?: string
  className?: string
}) {
  return (
    <Button type="submit" className={className} disabled={submit}>
      {submit ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Please wait
        </>
      ) : (
        text || "Continue"
      )}
    </Button>
  )
}
