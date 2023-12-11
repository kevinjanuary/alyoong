"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { signIn } from "next-auth/react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"

export const OAuthSignIn = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl: string = searchParams.get("redirect") || "/"
  const { toast } = useToast()

  function googleSignIn() {
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
