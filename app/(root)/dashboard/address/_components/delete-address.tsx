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
        <Button size="sm">Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete address?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            address data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <fieldset disabled={submit} className="group">
            <div className="flex gap-2">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              {submit ? (
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button variant="destructive" onClick={handleDelete}>
                  Delete
                </Button>
              )}
            </div>
          </fieldset>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
