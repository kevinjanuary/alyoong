"use client"

import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"
import Image from "next/image"
import { useSearchParams } from "next/navigation"

export const OAuthSignIn = () => {
  const searchParams = useSearchParams()

  const googleSignIn = () => {
    const redirectUrl: string = searchParams.get("redirect") || "/"

    signIn("google", {
      redirect: false,
      callbackUrl: redirectUrl,
    })
  }

  return (
    <Button onClick={googleSignIn} variant="outline" className="w-full gap-2">
      <Image
        src="/google.svg"
        width={20}
        height={20}
        alt="Google"
        className="w-5 h-5"
      />
      Continue with Google
    </Button>
  )
}
