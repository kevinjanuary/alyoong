"use client"

import { Button } from "@/components/ui/button"
import { Midtrans } from "./midtrans"
import { useState } from "react"

const PayButton = ({ snap_token }: { snap_token: string }) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Bayar</Button>
      {open && <Midtrans token={snap_token} />}
    </>
  )
}

export default PayButton
