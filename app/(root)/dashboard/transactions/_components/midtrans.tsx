"use client"

import { useEffect, useRef, useState } from "react"

export function Midtrans({ token }: { token: string }) {
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    console.log("CALLING MIDTRANS")
    const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js"
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY as string
    const script = document.createElement("script")
    script.src = snapScript
    script.setAttribute("data-client-key", clientKey)
    script.async = true
    script.onload = () => window.snap.pay(token)

    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [token])

  return <></>
}
