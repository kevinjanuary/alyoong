"use client"

import { useSearchParams } from "next/navigation"
import { Midtrans } from "./midtrans"

export function Pay() {
  const searchParams = useSearchParams()
  const pay = searchParams.get("pay")

  if (!pay) return null

  return <Midtrans token={pay} />
}
