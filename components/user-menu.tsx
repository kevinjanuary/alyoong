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
} from "lucide-react"

import { usePathname } from "next/navigation"

const UserMenu = ({ user }: { user: User | null }) => {
  const pathname = usePathname()

  return (
    <>
      {user ? (
        <>
          <Button variant="outline" size="icon" className="max-w-[40px] w-full">
            <ShoppingCart className="h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger className="select-none" asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage src={user?.image || undefined} />
                <AvatarFallback>GT</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/account">
                  <UserIcon className="h-4 w-4 mr-2" />
                  Account
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/products">
                  <Package className="h-4 w-4 mr-2" />
                  Products
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/orders">
                  <CircleDollarSign className="h-4 w-4 mr-2" />
                  Orders
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
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <>
          <Button asChild>
            <Link href={`/login?redirect=${pathname}`}>Login</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/register?redirect=${pathname}`}>Register</Link>
          </Button>
        </>
      )}
    </>
  )
}

export default UserMenu