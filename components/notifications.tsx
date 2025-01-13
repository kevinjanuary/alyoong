"use client"

import { BellIcon } from "lucide-react"
import { Button } from "./ui/button"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { readNotificationAction } from "@/actions/notifications"

export const Notifications = ({
  notifications,
}: {
  notifications:
    | {
        title: string
        id: number
        createdAt: Date
        userId: string
        message: string
        url: string
        read: boolean
      }[]
    | undefined
}) => {
  const hasUnreadNotifications = notifications?.some(
    (notification) => !notification.read
  )

  const handleClick = async (notificationId: number) => {
    await readNotificationAction({ notificationId })
  }

  return (
    <HoverCard openDelay={0} closeDelay={100}>
      <HoverCardTrigger asChild>
        <Button size="icon" variant="outline" className="relative">
          <BellIcon size={18} />
          {hasUnreadNotifications && (
            <span className="absolute top-2 right-3 w-2 h-2 bg-red-500 rounded-full"></span>
          )}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="px-0 py-2">
        <h2 className="text-lg font-bold px-4 pb-2">Notifications</h2>
        {notifications && notifications.length > 0 ? (
          notifications.map((notification) => (
            <Link href={notification.url} key={notification.id}>
              <div
                className={cn(
                  "py-2 px-4 border-b border-gray-300 hover:bg-gray-200 transition-colors",
                  !notification.read && "bg-gray-200/70"
                )}
                onClick={() => handleClick(notification.id)}
              >
                <p className="text-sm">{notification.message}</p>
              </div>
            </Link>
          ))
        ) : (
          <p className="px-4 text-sm text-gray-500">No new notifications</p>
        )}
      </HoverCardContent>
    </HoverCard>
  )
}
