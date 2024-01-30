"use client"

import { Product } from "@prisma/client"
import { TableCell, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"
import Link from "next/link"
import { currencyFormat } from "@/lib/currencyFormat"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { deleteProduct } from "@/actions/product"
import DeleteProduct from "./delete-product"
import { useState } from "react"

const ProductsTableBody = ({ product }: { product: Product }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <TableRow key={product.id}>
      <TableCell className="">
        <div className="grid grid-cols-[64px,auto] gap-4 items-center">
          <div className="mb-auto">
            <Image
              src={
                product.images ||
                "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
              }
              alt={product.name}
              width={64}
              height={64}
              className="w-16 h-16 overflow-hidden rounded-md aspect-square object-contain border"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-medium">
              <Link href={`/products/${product.id}`}>{product.name}</Link>
            </span>
            <span className="text-xs text-muted-foreground line-clamp-2">
              {product.description}
            </span>
          </div>
        </div>
      </TableCell>
      <TableCell>Rp{currencyFormat(Number(product.price))}</TableCell>
      <TableCell>{product.stock}</TableCell>
      <TableCell>
        <Badge variant="outline">{product.condition}</Badge>
      </TableCell>
      <TableCell>
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Link href={`/products/${product.id}`}>Lihat produk</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={`/dashboard/products/${product.id}/edit`}>
                Ubah produk
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault()
              }}
            >
              <DeleteProduct productId={product.id} setOpen={setIsOpen} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}

export default ProductsTableBody
