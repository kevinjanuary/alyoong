"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { useSelectedLayoutSegment } from "next/navigation"

import {
  Package,
  Settings,
  User as UserIcon,
  CircleDollarSign,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"

const NavbarBuyer = [
  {
    name: "Account",
    href: "/dashboard/account",
    icon: UserIcon,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]
const NavbarSeller = [
  {
    name: "Products",
    href: "/dashboard/products",
    icon: Package,
  },
  {
    name: "Orders",
    href: "/dashboard/orders",
    icon: CircleDollarSign,
  },
]

export function DashboardNav() {
  const segment = useSelectedLayoutSegment()

  return (
    <div className="flex w-full flex-col gap-2">
      {NavbarBuyer.map((item) => (
        <Link href={item.href} key={item.name}>
          <span
            className={cn(
              "group flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:bg-muted hover:text-foreground",
              item.href.includes(String(segment))
                ? "bg-muted text-foreground"
                : "text-muted-foreground"
            )}
          >
            <item.icon size={20} className="mr-2" />
            {item.name}
          </span>
        </Link>
      ))}
      <Separator />
      {NavbarSeller.map((item) => (
        <Link href={item.href} key={item.name}>
          <span
            className={cn(
              "group flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:bg-muted hover:text-foreground",
              item.href.includes(String(segment))
                ? "bg-muted text-foreground"
                : "text-muted-foreground"
            )}
          >
            <item.icon size={20} className="mr-2" />
            {item.name}
          </span>
        </Link>
      ))}
    </div>
  )
}
