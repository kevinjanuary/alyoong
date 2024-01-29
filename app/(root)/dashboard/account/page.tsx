import { getCurrentUser } from "@/lib/session"
import { PageHeading } from "../_components/page-heading"
import { redirect } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import ChangeNameForm from "./_components/change-name"
import ChangePasswordForm from "./_components/change-password"
import ChangeImagesForm from "./_components/change-images"

const AccountPage = async () => {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login?redirect=/dashboard/account")
  }

  return (
    <div>
      <PageHeading title="Akun" subtitle="Kelola akun Anda" />
      <div className="flex gap-8">
        <div className="mb-auto w-1/4">
          <Avatar className="w-full h-auto aspect-square">
            <AvatarImage
              src={user.image ? user.image + `?${Date.now()}` : undefined}
            />
            <AvatarFallback className="text-6xl">
              {user.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <ChangeImagesForm />
        </div>

        <div className="w-2/4 space-y-4">
          <ChangeNameForm user={user} />
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  )
}

export default AccountPage
