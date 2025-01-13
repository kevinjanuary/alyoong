import { getCurrentUser } from "@/lib/session"
import { UserRoles } from "@/lib/types"
import { redirect } from "next/navigation"
import { AdminSidebar, Navbar } from "./_components/admin-sidebar"

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login?redirect=/admin")
  }
  if (user.role !== UserRoles.ADMIN) {
    redirect("/")
  }

  return (
    <div className="h-full w-full flex overflow-hidden">
      <AdminSidebar>
        <Navbar />
      </AdminSidebar>

      <div className="main-content relative flex-1 max-h-screen bg-muted/40 overflow-x-hidden overflow-y-auto flex flex-col">
        <main className="flex flex-1 flex-col pt-4 px-4 md:pt-6 md:px-6">
          {children}
        </main>

        <div className="mt-auto text-xs text-muted-foreground md:text-right flex flex-col md:flex-row md:justify-between p-4 pt-8">
          <span>Version 1.14.25</span>
          <span>Copyrights © 2024. All rights reserved.</span>
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
