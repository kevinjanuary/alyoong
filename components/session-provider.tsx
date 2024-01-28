"use client"

import { SessionProvider } from "next-auth/react"

const Provider = ({ children }: React.PropsWithChildren) => {
  return <SessionProvider>{children}</SessionProvider>
}

export default Provider
