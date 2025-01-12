import { getCurrentUser } from "@/lib/session"
import Logo from "./logo"
import Navigation from "./navigation"
import SearchField from "./search-field"
import UserMenu from "./user-menu"

const Navbar = async () => {
  const currentUser = await getCurrentUser()

  return (
    <div className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="w-full mx-auto px-4 py-2 flex items-center justify-between max-w-7xl">
        <div className="flex gap-8">
          <Logo />
          <Navigation />
        </div>
        <div className="flex gap-2">
          <SearchField />
          <UserMenu user={currentUser} />
        </div>
      </div>
    </div>
  )
}

export default Navbar
