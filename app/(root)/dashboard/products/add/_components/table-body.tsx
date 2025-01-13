"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TableCell, TableRow } from "@/components/ui/table"
import { currencyFormat } from "@/lib/currencyFormat"
import { imageLoader } from "@/lib/utils-client"
import { Product } from "@prisma/client"
import { InfoIcon, MoreHorizontal } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import DeleteProduct from "./delete-product"
import { ProductApprovalStatus } from "@/lib/types"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ApprovalRequest } from "./approval-request"

const ProductsTableBody = ({ product }: { product: Product }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <TableRow key={product.id}>
      <TableCell className="">
        <div className="grid grid-cols-[64px,auto] gap-4 items-center">
          <div className="mb-auto">
            <Image
              loader={imageLoader}
              src={product.images}
              alt={product.name}
              width={64}
              height={64}
              className="w-16 h-16 overflow-hidden rounded-md aspect-square object-contain border"
            />
          </div>
          <div className="flex flex-col">
            {product.approval_status === ProductApprovalStatus.PENDING && (
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                <span className="text-xs text-yellow-500">
                  Menunggu persetujuan
                </span>
              </div>
            )}
            {product.approval_status === ProductApprovalStatus.REJECTED && (
              <div className="flex">
                <Popover>
                  <PopoverTrigger>
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                      <span className="text-xs text-red-500">Ditolak</span>
                      <InfoIcon className="h-3 w-3 text-red-500" />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent side="right" className="space-y-4">
                    <div className="text-sm">
                      <span className="font-semibold">Alasan:</span>{" "}
                      {product.rejection_reason}
                    </div>

                    <ApprovalRequest productId={product.id} />
                  </PopoverContent>
                </Popover>
              </div>
            )}

            <span className="font-medium">
              <Link href={`/products/${product.id}`}>{product.name}</Link>
            </span>
            <span className="text-xs text-muted-foreground line-clamp-2">
              {product.description}
            </span>
            <div>
              <Badge variant="outline" className="mb-1">
                {product.category}
              </Badge>
            </div>
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
