import { PageHeading } from "../_components/page-heading"
import { AddressModal } from "./_components/address-modal"
import { getCurrentUser } from "@/lib/session"
import { redirect } from "next/navigation"
import { db } from "@/lib/prismadb"
import { DeleteAddress } from "./_components/delete-address"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { NoData } from "../_components/no-data"
import PrimaryButton from "./_components/primary-button"

const AddressPage = async () => {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/login")
  }

  const addresses = await db.address.findMany({
    where: {
      userId: currentUser.id,
    },
    orderBy: {
      primary: "desc",
    },
  })

  return (
    <div>
      <PageHeading title="Alamat" subtitle="Kelola alamat Anda" />
      <div>
        <div className="mb-4">
          <AddressModal
            button="Tambah alamat"
            title="Tambah alamat"
            description="Pastikan Anda menambahkan alamat dengan benar."
            length={addresses.length}
          />
        </div>

        <div>
          {addresses.length > 0 ? (
            addresses.map((address) => (
              <div
                key={address.id}
                className={cn(
                  "border rounded-md mb-4",
                  address.primary && "border-2 border-slate-800 bg-slate-100"
                )}
              >
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex gap-2 text-sm font-medium text-gray-500">
                        {address.label}
                        {address.primary && <Badge>Utama</Badge>}
                      </div>
                      <div className="text-lg font-medium">{address.name}</div>
                      <div className="text-sm text-gray-500">
                        {address.phone}
                      </div>
                      <div className="text-sm text-gray-500">
                        {address.address}{" "}
                        {address.notes && `(${address.notes})`}
                      </div>
                      <div className="text-sm text-gray-500">
                        {address.city_district} {address.postal_code}
                      </div>
                    </div>
                    <div className="flex items-start justify-end gap-2">
                      <AddressModal
                        button="Ubah"
                        title="Ubah alamat"
                        description="Pastikan Anda mengubah alamat dengan benar."
                        defaultValue={address}
                        noCounter
                        editMode
                      />
                      {!address.primary && (
                        <>
                          <PrimaryButton addressId={address.id} />
                          <DeleteAddress id={address.id} />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <NoData
              title="Yahh! Kamu belum punya alamat nih!"
              description="Kamu harus punya alamat untuk bisa belanja di Alyoong. Yukk tambahin satu alamat dulu!"
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default AddressPage
