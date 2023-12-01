import Logo from "./logo"
import Navigation from "./navigation"
import { Input } from "./ui/input"
import { Search } from "lucide-react"
import UserMenu from "./user-menu"
import { getCurrentUser } from "@/lib/session"

const Navbar = async () => {
  const currentUser = await getCurrentUser()

  return (
    <div className="bg-white border-b shadow-sm">
      <div className="w-full mx-auto px-8 py-2 flex items-center justify-between max-w-7xl">
        <div className="flex gap-8">
          <Logo />
          <Navigation />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Input
              type="text"
              placeholder="Mau cari apa hari ini?"
              className="pl-10"
            />
            <Search size={16} className="absolute top-3 left-3" />
          </div>
          <UserMenu user={currentUser} />
        </div>
      </div>
    </div>
  )
}

export default Navbar
