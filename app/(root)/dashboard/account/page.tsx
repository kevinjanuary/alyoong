import { getSession } from "@/lib/session"
import { PageHeading } from "../_components/page-heading"
import { redirect } from "next/navigation"
import Image from "next/image"

const AccountPage = async () => {
  const currentSession = await getSession()

  if (!currentSession) {
    redirect("/login?redirect=/dashboard/account")
  }

  return (
    <div>
      <PageHeading title="Akun" subtitle="Kelola akun Anda" />
      <div className="flex flex-col">
        <Image
          src={currentSession.user?.image || ""}
          alt="..."
          width={200}
          height={200}
          className="w-28"
        />
        <span>Email: {currentSession.user?.email}</span>
        <span>Nama: {currentSession.user?.name}</span>
      </div>
    </div>
  )
}

export default AccountPage
