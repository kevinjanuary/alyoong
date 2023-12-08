import { Button } from "@/components/ui/button"
import { PageHeading } from "../_components/page-heading"
import { AddressModal } from "./_components/address-modal"
import { getCurrentUser } from "@/lib/session"
import { redirect } from "next/navigation"
import { db } from "@/lib/prismadb"
import { DeleteAddress } from "./_components/delete-address"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

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
      <PageHeading title="Address" subtitle="Manage your address" />
      <div>
        <div className="mb-4 flex gap-2 items-center justify-end">
          <span>{addresses.length}/3</span>
          <AddressModal
            button="Add new address"
            title="Add new address"
            description="Make sure you add the address correctly."
            max={addresses.length}
          />
        </div>

        <div>
          {addresses.map((address) => (
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
                      {address.primary && <Badge>Primary</Badge>}
                    </div>
                    <div className="text-lg font-medium">{address.name}</div>
                    <div className="text-sm text-gray-500">{address.phone}</div>
                    <div className="text-sm text-gray-500">
                      {address.address} {address.notes && `(${address.notes})`}
                    </div>
                    <div className="text-sm text-gray-500">
                      {address.city_district} {address.postal_code}
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button size="sm">Make primary</Button>
                    <DeleteAddress id={address.id} />

                    <AddressModal
                      button="Edit"
                      title="Edit address"
                      description="Make sure you edit the address correctly."
                      defaultValue={address}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AddressPage
