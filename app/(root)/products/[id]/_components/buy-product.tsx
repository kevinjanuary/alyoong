"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { currencyFormat } from "@/lib/currencyFormat"
import { AlertCircle, CreditCard, Loader2, Minus, Plus } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { SelectAddress } from "./select-address"
import { Address } from "@prisma/client"
import { Separator } from "@/components/ui/separator"

type Courier = {
  name: string
  cost: number
}

export function BuyProduct({
  id,
  title,
  price,
  stock,
  images,
  weight,
  dimension,
  origin,
}: {
  id: string
  title: string
  price: number
  stock: number
  images: string
  weight: number
  dimension: string
  origin: Address
}) {
  const [open, setOpen] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [address, setAddress] = useState("")
  const [courier, setCourier] = useState<Courier>()

  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const decreaseQuantity = () => {
    setQuantity((prevState) => (quantity > 1 ? prevState - 1 : 1))
  }

  const increaseQuantity = () => {
    setQuantity((prevState) => (quantity < stock ? prevState + 1 : stock))
  }

  const createTransaction = async () => {
    if (quantity > stock) {
      alert("Jumlah barang melebihi stock yang tersedia")
      return
    }
    setIsLoading(true)

    const data = {
      productId: id,
      title: title.substring(0, 50).trim(),
      price: price,
      quantity: quantity,
      address: address,
      shippingCost: courier?.cost,
      weight: weight,
      courier: courier?.name,
    }

    const res = await fetch("/api/transactions", {
      method: "POST",
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      alert("Terjadi kesalahan, silahkan coba lagi")
      setIsLoading(false)
      return
    }

    const requestData = await res.json()

    router.push(`/dashboard/transactions?pay=${requestData.snap_token}`)
  }

  return (
    <div className="flex gap-4 items-center">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button>Beli Sekarang</Button>
        </SheetTrigger>
        <SheetContent className="w-full max-w-[400px] sm:max-w-[540px] flex flex-col gap-0 overflow-auto">
          <SheetHeader>
            <SheetTitle>Beli sekarang</SheetTitle>
            <SheetDescription>
              Beli langsung barangmu tanpa ribet!
            </SheetDescription>
            <div className="py-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Peringatan!</AlertTitle>
                <AlertDescription>
                  Ini halaman terakhir dari proses belanjamu. Pastikan semua
                  sudah benar, ya!!
                </AlertDescription>
              </Alert>
            </div>
          </SheetHeader>
          <div className="py-4">
            <span className="text-md font-medium">Barang yang dibeli</span>
            <div className="grid gap-4 grid-cols-[64px,auto] my-4">
              <div className="w-full">
                <Image
                  src={images}
                  alt={title}
                  width={64}
                  height={64}
                  className="block rounded-lg"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm">{title}</span>
                <div className="flex gap-2 text-muted-foreground text-xs">
                  <span>{weight} grams</span>
                  <span>{dimension}</span>
                </div>
                <span className="text-sm font-medium">
                  Rp{currencyFormat(price)}
                </span>

                <div className="flex items-center gap-2">
                  <div className="flex border rounded-md">
                    <Button
                      onClick={decreaseQuantity}
                      size="icon"
                      variant="ghost"
                      disabled={quantity <= 1 && true}
                    >
                      <Minus size={16} />
                    </Button>
                    <Input
                      type="text"
                      pattern="[0-9]"
                      value={quantity}
                      min={1}
                      max={stock}
                      className="w-16 border-none text-center"
                      onChange={(e) =>
                        setQuantity(
                          isNaN(Number(e.target.value))
                            ? 1
                            : Math.min(
                                Math.max(Number(e.target.value), 1),
                                stock
                              )
                        )
                      }
                    />
                    <Button
                      onClick={increaseQuantity}
                      size="icon"
                      variant="ghost"
                      disabled={quantity >= stock && true}
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                  <span>Stock: {stock}</span>
                </div>
              </div>
            </div>
            <span className="text-md font-medium">Pengiriman</span>
            <SelectAddress
              origin={origin}
              weight={weight}
              setAddress={(e) => setAddress(e)}
              courier={(e) => setCourier(e)}
            />
          </div>
          <div className="flex flex-col gap-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Total Harga ({quantity} Barang)
              </span>
              <span>Rp{currencyFormat(price)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Biaya Pengiriman ({weight} grams)
              </span>
              <span>Rp{courier ? currencyFormat(courier.cost) : 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Biaya Layanan</span>
              <span>Rp5.000</span>
            </div>
            <Separator />
            <div className="flex justify-between font-medium">
              <span>Total Bayar</span>
              <span>
                Rp
                {currencyFormat(
                  price * quantity + (courier ? courier.cost : 0) + 5000
                )}
              </span>
            </div>
          </div>
          <div className="flex gap-4 items-center justify-end mt-auto">
            {isLoading ? (
              <Button disabled className="flex gap-2 pr-4">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Harap tunggu...
              </Button>
            ) : (
              <Button
                disabled={!address || !courier}
                onClick={createTransaction}
                className="flex gap-2 pr-4"
              >
                <CreditCard />
                Bayar
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex border rounded-md">
        <Button
          onClick={decreaseQuantity}
          size="icon"
          variant="ghost"
          disabled={quantity <= 1}
        >
          <Minus size={16} />
        </Button>
        <Input
          type="text"
          pattern="[0-9]"
          value={quantity}
          min={1}
          max={stock}
          className="w-16 border-none text-center"
          onChange={(e) =>
            setQuantity(
              isNaN(Number(e.target.value))
                ? 1
                : Math.min(Math.max(Number(e.target.value), 1), stock)
            )
          }
        />
        <Button
          onClick={increaseQuantity}
          size="icon"
          variant="ghost"
          disabled={quantity >= stock}
        >
          <Plus size={16} />
        </Button>
      </div>
      <span>Stock: {stock}</span>
    </div>
  )
}
