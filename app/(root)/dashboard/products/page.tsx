import { Button } from "@/components/ui/button"
import Link from "next/link"
import { db } from "@/lib/prismadb"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/session"
import { ProductsTable } from "./add/_components/products-table"
import { NoData } from "../_components/no-data"
import { AddressModal } from "../address/_components/address-modal"

const ProductsPage = async () => {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/login")
  }

  const address = await db.address.findFirst({
    where: {
      userId: currentUser.id,
      primary: true,
    },
  })

  return (
    <div>
      {address ? (
        <>
          <div className="mb-4 flex justify-end">
            <Button size="sm" asChild>
              <Link href="/dashboard/products/add">Add product</Link>
            </Button>
          </div>
          <ProductsTable currentUser={currentUser} />
        </>
      ) : (
        <NoData
          title="Yahh! Kamu harus punya alamat utama!"
          description="Kamu harus punya alamat utama untuk bisa jualan di Alyoong. Yukk
        tambahin satu alamat utama dulu!"
        >
          <AddressModal
            button="Tambah alamat"
            title="Tambah alamat utama"
            description="Tambahkan alamat utama kamu untuk bisa jualan di Alyoong!"
          />
        </NoData>
      )}
    </div>
  )
}

export default ProductsPage
