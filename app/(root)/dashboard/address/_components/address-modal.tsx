"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AddressForm } from "./address-form"
import { TAddressFullSchema } from "@/lib/types"

export function AddressModal({
  button,
  title,
  description,
  max = 0,
  defaultValue,
}: {
  button: string
  title: string
  description: string
  max?: number
  defaultValue?: TAddressFullSchema
}) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" disabled={max >= 3 || false}>
          {button}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="grow">
          <div className="px-6 py-4">
            <AddressForm
              setOpen={() => setOpen(false)}
              defaultValue={defaultValue}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
