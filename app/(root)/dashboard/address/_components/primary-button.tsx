"use client"

import { primaryAddress } from "@/actions/address"
import { Button } from "@/components/ui/button"

const PrimaryButton = ({ addressId }: { addressId: string }) => {
  return (
    <Button
      size="sm"
      onClick={async () => {
        const makePrimary = await primaryAddress(addressId)
        console.log(makePrimary)
      }}
    >
      Jadikan utama
    </Button>
  )
}

export default PrimaryButton
