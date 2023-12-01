import Link from "next/link"

const categories = [
  {
    name: "PC",
    path: "/",
  },
  {
    name: "Monitor",
    path: "/",
  },
  {
    name: "Keyboard",
    path: "/",
  },
  {
    name: "Mouse",
    path: "/",
  },
  {
    name: "Graphic Card",
    path: "/",
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
