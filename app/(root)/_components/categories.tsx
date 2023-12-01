import { Monitor, MemoryStick, Keyboard, Mouse } from "lucide-react"
import Link from "next/link"

const Categories = () => {
  return (
    <div className="mt-4 grid grid-cols-4 gap-4 max-w-5xl w-full">
      <Link href="/">
        <div className="border rounded-lg bg-white p-6 flex flex-col shadow-sm">
          <Monitor />
          <span>Monitor</span>
          <span>{Math.floor(Math.random() * 201) + 50} products</span>
        </div>
      </Link>
      <Link href="/">
        <div className="border rounded-lg bg-white p-6 flex flex-col shadow-sm">
          <MemoryStick />
          <span>Graphic Card</span>
          <span>{Math.floor(Math.random() * 201) + 50} products</span>
        </div>
      </Link>
      <Link href="/">
        <div className="border rounded-lg bg-white p-6 flex flex-col shadow-sm">
          <Keyboard />
          <span>Keyboard</span>
          <span>{Math.floor(Math.random() * 201) + 50} products</span>
        </div>
      </Link>
      <Link href="/">
        <div className="border rounded-lg bg-white p-6 flex flex-col shadow-sm">
          <Mouse />
          <span>Mouse</span>
          <span>{Math.floor(Math.random() * 201) + 50} products</span>
        </div>
      </Link>
    </div>
  )
}

export default Categories
