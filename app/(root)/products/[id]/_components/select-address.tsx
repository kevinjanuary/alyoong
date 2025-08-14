"use client"

import { useEffect, useRef, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Address } from "@prisma/client"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { AddressModal } from "@/app/(root)/dashboard/address/_components/address-modal"

import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CostResultType, CostsType } from "@/lib/types"
import { currencyFormat } from "@/lib/currencyFormat"

export function SelectAddress({
  weight,
  origin,
  setAddress,
  courier,
}: {
  weight: number
  origin: Address
  setAddress: (address: string) => void
  courier: ({ name, cost }: { name: string; cost: number }) => void
}) {
  const [open, setOpen] = useState(false)
  const [data, setData] = useState<Address[] | null>(null)
  const [selected, setSelected] = useState<Address | null>(null)

  const [defaultCourier, setDefaultCourier] = useState<string>("")
  const [couriers, setCouriers] = useState<CostResultType>()

  const isFirstRender = useRef(true)

  const getAddress = async (change?: boolean) => {
    if (!change && data) return
    const response = await fetch("/api/address")
    const addresses = await response.json()
    setData(addresses)
  }

  const setSelectedAddress = async (address: Address) => {
    setSelected(address)
    setOpen(false)
  }

  useEffect(() => {
    if (selected) {
      console.log("INSIDE SELECTED")
      console.log({ origin, selected })

      fetch("/api/rajaongkir/cost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          origin: origin.city_id,
          destination: selected.city_id,
          weight: weight,
        }),
      }).then(async (response) => {
        const res: CostResultType = await response.json()
        setDefaultCourier(res[0]?.code.toUpperCase())
        setCouriers(res)
        setAddress(
          `${selected.name} (${selected.phone})\n${selected.address} ${
            selected.notes && `(${selected.notes}),`
          }\n${selected.city_district} ${selected.postal_code}`
        )
        courier({
          name: `${res[0]?.code.toUpperCase()} ${res[0]?.service}`,
          cost: res[0]?.cost,
        })
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [origin, selected, weight])

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    fetch("/api/address").then(async (response) => {
      const addresses: Address[] = await response.json()
      setData(addresses)

      const address = addresses.find((address) => address.primary)
      address && setSelectedAddress(address)
    })
  }, [])

  return (
    <div className="flex flex-col">
      <Card className="my-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <div
              className="flex items-center justify-between py-3 px-4 gap-2 cursor-pointer"
              onClick={() => getAddress()}
            >
              {selected ? (
                <div className="flex flex-col gap-2 text-xs">
                  <div className="flex gap-2 items-center">
                    {selected.primary && <Badge>Primary</Badge>}
                    <div>
                      <span className="font-medium">{selected.label}</span>
                      {` - ${selected.name} (${selected.phone})`}
                    </div>
                  </div>
                  <div className="text-muted-foreground">
                    {selected.address}{" "}
                    {selected.notes && `(${selected.notes}), `}
                    {selected.city_district} {selected.postal_code}
                  </div>
                </div>
              ) : (
                <span>Pilih alamat pengiriman</span>
              )}
              <ChevronRight />
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Pilih Alamat</DialogTitle>
              <DialogDescription>Pilih alamat pengiriman</DialogDescription>
            </DialogHeader>
            <div className="mt-4 mx-6">
              <AddressModal
                button="Add new address"
                title="Add new address"
                description="Make sure you add the address correctly."
                length={data?.length}
                onChange={() => getAddress(true)}
              />
            </div>
            <ScrollArea className="grow">
              <div className="px-6 py-4">
                {data?.map((address) => (
                  <div
                    key={address.id}
                    className={cn(
                      "border rounded-md mb-4",
                      address.id === selected?.id &&
                        "border-2 border-slate-800 bg-slate-100"
                    )}
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <div className="flex gap-2 text-sm font-medium text-gray-500">
                            {address.label}
                            {address.primary && <Badge>Primary</Badge>}
                          </div>
                          <div className="text-lg font-medium">
                            {address.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {address.phone}
                          </div>
                          <div className="text-sm text-gray-500">
                            {address.address}{" "}
                            {address.notes && `(${address.notes})`}
                          </div>
                          <div className="text-sm text-gray-500">
                            {address.city_district} {address.postal_code}
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          {address.id !== selected?.id && (
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedAddress(address)
                              }}
                            >
                              Pilih
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
        {selected && (
          <>
            <Separator />
            <div className="py-3 px-4 text-sm">Pilih metode pengiriman</div>
            {couriers && (
              <div className="px-4 pb-4">
                <Select
                  defaultValue={couriers[0]?.cost.toString()}
                  onValueChange={(e) => {
                    const value = parseInt(e)
                    const selectedCost = couriers.find(
                      (item) => item.cost === value
                    )
                    selectedCost &&
                      courier({
                        name: `${defaultCourier} ${selectedCost.service}`,
                        cost: value,
                      })
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Metode pengiriman" />
                  </SelectTrigger>
                  <SelectContent>
                    {couriers.map((item) => (
                      <SelectItem
                        key={item.service}
                        value={item.cost.toString()}
                      >
                        {`${defaultCourier} ${item.service} (${
                          item.etd
                        }) - Rp ${currencyFormat(item.cost)}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  )
}
