"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { redirect } from "next/navigation"

const ThankyouPage = ({
  searchParams,
}: {
  searchParams: { [key: string]: string }
}) => {
  if (window.location.hostname !== "localhost") {
    redirect(`http://localhost:3000/thank-you${window.location.search}`)
  }
  const { order_id, status_code, transaction_status } = searchParams

  return (
    <div className="h-full flex flex-col items-center justify-center gap-8">
      <h1 className="text-5xl font-semibold">OrderId #{order_id}</h1>
      {status_code === "200" && transaction_status === "settlement" ? (
        <>
          <h2 className="text-3xl text-green-600">
            Payment has been completed!
          </h2>
          <h3 className="text-xl">Thank you for your purchase!</h3>
          <Button className="mt-8" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </>
      ) : (
        <h2 className="text-3xl text-red-600">Oops, something went wrong!</h2>
      )}
    </div>
  )
}

export default ThankyouPage
