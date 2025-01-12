import { getCurrentUser } from "@/lib/session"
import Logo from "./logo"
import Navigation from "./navigation"
import SearchField from "./search-field"
import UserMenu from "./user-menu"
import { UserRoles } from "@/lib/types"
import Link from "next/link"

const Navbar = async () => {
  const currentUser = await getCurrentUser()

  return (
    <>
      {currentUser?.role === UserRoles.ADMIN && (
        <div className="bg-[#004AAD] text-white text-center text-sm py-2">
          You are currently logged in as an admin.{" "}
          <Link href="/admin">Go to admin panel</Link>
        </div>
      )}

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
    </>
  )
}

export default Navbar
