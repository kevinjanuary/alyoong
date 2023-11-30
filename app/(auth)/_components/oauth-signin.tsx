"use client"

import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"
import Image from "next/image"

export const OAuthSignIn = () => {
  return (
    <Button
      onClick={() => signIn("google", { callbackUrl: "/" })}
      variant="outline"
      className="w-full gap-2"
    >
      <Image src="/google.svg" width={20} height={20} alt="Google" />
      Continue with Google
    </Button>
  )
}
