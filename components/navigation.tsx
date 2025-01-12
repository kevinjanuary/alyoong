import Link from "next/link"

const categories = [
  {
    name: "PC",
    path: "/products?category=PC",
  },
  {
    name: "Monitor",
    path: "/products?category=Monitor",
  },
  {
    name: "Keyboard",
    path: "/products?category=Keyboard",
  },
  {
    name: "Mouse",
    path: "/products?category=Mouse",
  },
  {
    name: "Graphic Card",
    path: "/products?category=Graphic Card",
  },
]

const Navigation = () => {
  return (
    <nav className="flex gap-4 items-center">
      {categories.map((category) => (
        <Link key={category.name} href={category.path}>
          {category.name}
        </Link>
      ))}
    </nav>
  )
}

export default Navigation
