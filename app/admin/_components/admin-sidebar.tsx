"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import {
  ChevronsUpDownIcon,
  CircleUserRoundIcon,
  HomeIcon,
  LogOutIcon,
  MessageCircleMoreIcon,
  PackageIcon,
  PackageSearchIcon,
  ReceiptIcon,
  SettingsIcon,
  StarIcon,
  UserRoundIcon,
  UsersRoundIcon,
} from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

export const AdminSidebar = ({ children }: { children: React.ReactNode }) => {
  return (
    <aside className="shrink-0 group bg-background hidden md:flex flex-col justify-between border-r w-52 transition-[width] duration-500">
      <NavOverflow>{children}</NavOverflow>

      <div className="flex flex-col gap-1 px-2">
        <div className="-mx-2 mt-1 border-t p-2 text-sm">
          <AdminProfile />
        </div>
      </div>
    </aside>
  )
}

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="flex-1 flex flex-col gap-1">
      <div className="w-[150px] h-[33px] mb-2">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Alyoong"
            width={150}
            height={33}
            unoptimized
          />
        </Link>
      </div>

      <NavMenu
        title="Dashboard"
        link="/admin"
        icon={<HomeIcon size={18} />}
        pathname={pathname === "/admin"}
      />

      <Separator className="my-1" />

      <NavMenu
        title="New Product"
        link="/admin/products/new"
        icon={<PackageSearchIcon size={18} />}
        pathname={pathname}
      />

      <Separator className="my-1 h-[0.5px]" />

      <NavMenu
        title="User"
        link="/admin/users"
        icon={<UsersRoundIcon size={18} />}
        pathname={pathname}
      />

      <NavMenu
        title="Product"
        link="/admin/products"
        icon={<PackageIcon size={18} />}
        pathname={pathname === "/admin/products"}
      />

      <NavMenu
        title="Comment"
        link="/admin/comments"
        icon={<MessageCircleMoreIcon size={18} />}
        pathname={pathname}
      />

      <NavMenu
        title="Transaction"
        link="/admin/transactions"
        icon={<ReceiptIcon size={18} />}
        pathname={pathname}
      />

      <NavMenu
        title="Review"
        link="/admin/reviews"
        icon={<StarIcon size={18} />}
        pathname={pathname}
      />

      <Separator className="my-1" />

      <NavMenu
        title="Tombol Nuklir"
        link="/admin/settings"
        icon={<SettingsIcon size={18} />}
        pathname={pathname}
      />
    </nav>
  )
}

function NavOverflow({ children }: { children: React.ReactNode }) {
  const navRef = useRef<HTMLDivElement>(null)
  const [isOverflowing, setIsOverflowing] = useState(false)

  useEffect(() => {
    const checkOverflow = () => {
      if (navRef.current) {
        setIsOverflowing(false)
        setTimeout(() => {
          if (navRef.current!.scrollHeight > navRef.current!.clientHeight) {
            setIsOverflowing(true)
          }
        })
      }
    }

    checkOverflow()
    window.addEventListener("resize", checkOverflow)

    return () => {
      window.removeEventListener("resize", checkOverflow)
    }
  }, [])

  return (
    <div
      className="overflow-y-auto p-2 pb-0 no-scrollbar relative"
      ref={navRef}
    >
      {children}

      {isOverflowing && (
        <div className="sticky bottom-0 left-0 right-0 bg-gradient-to-t from-background to-transparent h-10 pointer-events-none"></div>
      )}
    </div>
  )
}

function AdminProfile({
  side = "right",
  trigger,
}: {
  side?: "bottom" | "right"
  trigger?: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { data } = useSession({
    required: true,
    onUnauthenticated() {
      router.replace("/login?redirect=" + pathname)
    },
  })

  const handleClick = async () => {
    signOut({
      callbackUrl: "/",
    })
  }

  if (!data || !data.user) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger || (
          <Button
            variant="ghost"
            className="w-full gap-2 p-0 justify-start overflow-hidden text-muted-foreground transition-colors hover:text-foreground hover:bg-accent/60"
          >
            <span className="shrink-0 size-10 inline-flex items-center justify-center">
              <UserRoundIcon size={18} />
            </span>
            <div className="flex-1 flex gap-2 items-center justify-between pr-2 whitespace-nowrap transition-[opacity] duration-300 opacity-100">
              <span>{data?.user.name}</span>
              <ChevronsUpDownIcon size={16} />
            </div>
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent side={side} align="end">
        <DropdownMenuItem className="flex gap-2" asChild>
          <Link href="/dashboard/account">
            <CircleUserRoundIcon size={16} />
            <span>Account</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex gap-2 text-red-500"
          onClick={handleClick}
        >
          <LogOutIcon size={16} />
          <span>Keluar</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function NavMenu({
  title,
  link,
  icon,
  pathname,
  className,
  additional,
}: {
  title: string
  link: string
  icon: React.ReactNode
  pathname: string | boolean
  className?: string
  additional?: React.ReactNode
}) {
  return (
    <Link
      href={link}
      className={cn(
        "flex gap-2 px-3 py-2 overflow-hidden items-center rounded-lg text-sm text-muted-foreground transition-colors hover:text-foreground hover:bg-accent/60",
        className,
        (typeof pathname === "string" ? pathname.startsWith(link) : pathname) &&
          "text-foreground bg-accent"
      )}
    >
      <span className="shrink-0 size-10 inline-flex items-center justify-center">
        {icon}
      </span>
      <span className="flex-1 flex items-center justify-between whitespace-nowrap transition-[opacity] duration-300 opacity-100">
        {title}
        {additional}
      </span>
    </Link>
  )
}
