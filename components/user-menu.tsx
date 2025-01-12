"use client"

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import type { User } from "@prisma/client"
import { signOut } from "next-auth/react"
import Link from "next/link"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  ShoppingCart,
  User as UserIcon,
  Settings,
  Package,
  CircleDollarSign,
  LogOut,
  MapPin,
  ShoppingBag,
} from "lucide-react"

import { usePathname } from "next/navigation"
import { currencyFormat } from "@/lib/currencyFormat"

const UserMenu = ({ user }: { user: User | null }) => {
  const pathname = usePathname()

  if (!user) {
    return (
      <>
        <Button asChild>
          <Link href={`/login?redirect=${pathname}`}>Login</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href={`/register?redirect=${pathname}`}>Register</Link>
        </Button>
      </>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="select-none" asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage
            src={process.env.NEXT_PUBLIC_IMAGE_URL! + user.image || undefined}
          />
          <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[150px]">
        <DropdownMenuLabel className="flex flex-col space-y-1 pr-4">
          <span className="text-sm font-medium leading-none">{user.name}</span>
          <span className="text-xs leading-none text-muted-foreground">
            {user.email}
          </span>
          <span>Rp {currencyFormat(user.balance)}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard/account">
            <UserIcon className="h-4 w-4 mr-2" />
            Akun saya
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/address">
            <MapPin className="h-4 w-4 mr-2" />
            Alamat
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/settings">
            <Settings className="h-4 w-4 mr-2" />
            Pengaturan
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard/transactions">
            <ShoppingBag className="h-4 w-4 mr-2" />
            Transaksi
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard/products">
            <Package className="h-4 w-4 mr-2" />
            Produk
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/orders">
            <CircleDollarSign className="h-4 w-4 mr-2" />
            Pesanan
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={(event: any) => {
            event.preventDefault()
            signOut()
          }}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Keluar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserMenu
