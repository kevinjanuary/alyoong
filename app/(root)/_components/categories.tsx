import { db } from "@/lib/prismadb"
import { ProductApprovalStatus } from "@/lib/types"
import {
  Gamepad2Icon,
  Keyboard,
  LucideIcon,
  MemoryStick,
  Monitor,
  Mouse,
} from "lucide-react"
import Link from "next/link"

const CategoryIcons: Record<string, LucideIcon> = {
  Monitor: Monitor,
  "Graphic Card": MemoryStick,
  Keyboard: Keyboard,
  Mouse: Mouse,
}

const Categories = async () => {
  const categories = await db.product.groupBy({
    by: ["category"],
    _count: {
      id: true,
    },
    orderBy: {
      _count: {
        id: "desc",
      },
    },
    where: {
      approval_status: ProductApprovalStatus.APPROVED,
    },
  })

  const max8Categories = categories.slice(0, 8)

  return (
    <div className="mt-4 grid grid-cols-4 gap-4 max-w-5xl w-full">
      {max8Categories.map((category) => {
        const Icon = CategoryIcons[category.category] || Gamepad2Icon

        return (
          <Link
            key={category.category}
            href={`/products?category=${category.category}`}
          >
            <div className="border rounded-lg hover:bg-secondary transition-colors p-6 flex items-center gap-4 shadow-md text-sm">
              <Icon className="w-8 h-8" />
              <div className="flex flex-col">
                <span className="font-semibold">{category.category}</span>
                <span className="text-gray-500">
                  {category._count.id} products
                </span>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

export default Categories
