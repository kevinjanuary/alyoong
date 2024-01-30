"use client"

import { useEffect, useState } from "react"
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
import { Address } from "@prisma/client"

export function AddressModal({
  button,
  title,
  description,
  length = 0,
  noCounter = false,
  defaultValue,
  onChange,
  editMode = false,
}: {
  button: string
  title: string
  description: string
  noCounter?: boolean
  length?: number
  defaultValue?: Address
  onChange?: () => void
  editMode?: boolean
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex items-center justify-end gap-2">
      {!noCounter && <span>{length}/3</span>}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm" disabled={length >= 3 || false}>
            {button}
          </Button>
        </DialogTrigger>
        <DialogContent className="h-full">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <ScrollArea className="grow">
            <div className="px-6 py-4">
              <AddressForm
                setOpen={() => setOpen(false)}
                defaultValue={defaultValue}
                onChange={onChange}
                editMode={editMode}
              />
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}
