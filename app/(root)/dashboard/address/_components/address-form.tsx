"use client"

import { useForm } from "react-hook-form"
import { TAddressFullSchema, TAddressSchema, addressSchema } from "@/lib/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { CityDistrictResultType, resultType } from "@/lib/types"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { SubmitButton } from "@/components/submit-button"
import { editAddress } from "@/actions/address"
import { Address } from "@prisma/client"

const city = [
  "Jakarta",
  "Bogor",
  "Depok",
  "Tangerang",
  "Bekasi",
  "Bandung",
  "Semarang",
  "Surabaya",
  "Yogyakarta",
  "Malang",
] as const

export function AddressForm({
  setOpen,
  defaultValue,
  onChange,
  editMode = false,
}: {
  setOpen: () => void
  defaultValue?: Address
  onChange?: () => void
  editMode?: boolean
}) {
  const [cityDistrictFocus, setCityDistrictFocus] = useState(false)

  const [cityDistrictQuery, setCityDistrictQuery] = useState(
    defaultValue?.city_district || ""
  )
  const [cityDistrictResult, setCityDistrictResult] = useState<
    CityDistrictResultType[] | null
  >(null)
  const [cityDistrictResultSucess, setCityDistrictResultSucess] =
    useState(false)
  const [cityDistrictSelected, setCityDistrictSelected] = useState<
    string | null
  >(defaultValue?.city_district || null)

  const [postalCode, setPostalCode] = useState(defaultValue?.postal_code || "")
  const [postalCodeResult, setPostalCodeResult] = useState<
    CityDistrictResultType[] | null
  >(null)

  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<TAddressSchema>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      label: defaultValue?.label || "",
      name: defaultValue?.name || "",
      phone: defaultValue?.phone || "",
      city_district: defaultValue?.city_district || "",
      address: defaultValue?.address || "",
      postal_code: defaultValue?.postal_code || "",
      notes: defaultValue?.notes || "",
    },
  })
  const isSubmitting = form.formState.isSubmitting

  const onEdit = async (values: z.infer<typeof addressSchema>) => {
    if (!defaultValue) return

    const result = cityDistrictResult
      ? cityDistrictResult.find((item) => item.id === cityDistrictSelected)
      : {
          name: defaultValue.city_district,
          administrative_division_level_1_name: defaultValue.province,
          administrative_division_level_2_name: defaultValue.city,
          administrative_division_level_3_name: defaultValue.district,
        }
    if (!result) throw "City District not found"
    if (postalCode.length < 5) throw "Postal Code not found"

    const {
      name,
      administrative_division_level_1_name,
      administrative_division_level_2_name,
      administrative_division_level_3_name,
    } = result

    const res = await editAddress(defaultValue.id, {
      ...values,
      city_district: name,
      province: administrative_division_level_1_name,
      city: administrative_division_level_2_name,
      district: administrative_division_level_3_name,
      province_id: defaultValue.province_id,
      city_id: defaultValue.city_id,
    })

    if (!res.success) {
      toast({
        variant: "destructive",
        title: "Something went wrong.",
        description: "There was a problem with your request. Please try again.",
        duration: 2000,
      })
    }

    toast({
      title: "Address has added!",
      description: "Successfully added address.",
      duration: 2000,
    })
    setOpen()
    onChange && onChange()

    router.refresh()
  }

  async function onSubmit(values: z.infer<typeof addressSchema>) {
    try {
      const result = cityDistrictResult?.find(
        (item) => item.id === cityDistrictSelected
      )

      if (!result) throw "City District not found"
      if (postalCode.length < 5) throw "Postal Code not found"

      const {
        name,
        administrative_division_level_1_name,
        administrative_division_level_2_name,
        administrative_division_level_3_name,
      } = result

      const res = await fetch("/api/address", {
        method: "POST",
        body: JSON.stringify({
          ...values,
          city_district: name,
          province: administrative_division_level_1_name,
          city: administrative_division_level_2_name,
          district: administrative_division_level_3_name,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!res.ok) throw "Add address failed. Please try again."

      toast({
        title: "Address has added!",
        description: "Successfully added address.",
        duration: 2000,
      })
      setOpen()
      onChange && onChange()

      router.refresh()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong.",
        description: error
          ? `${error}`
          : "There was a problem with your request. Please try again.",
        duration: 2000,
      })
    }
  }

  const selectCityDistrict = async (name: string, id: string) => {
    setCityDistrictSelected(id)
    setCityDistrictQuery(name)
    const res = await fetch("/api/biteship/postalcode", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ areaId: id }),
    })
    const data: resultType = await res.json()
    setPostalCodeResult(data.areas)
    console.log({ postalCodeResult })
  }

  useEffect(() => {
    if (cityDistrictQuery.length < 3 || cityDistrictSelected) return
    const timeoutId = setTimeout(async () => {
      console.log("User query: ", cityDistrictQuery)
      const res = await fetch("/api/biteship", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: cityDistrictQuery }),
      })
      const data: resultType = await res.json()
      setCityDistrictResult(data.areas)
      setCityDistrictResultSucess(data.success)
      console.log({ cityDistrictResult })
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [cityDistrictQuery])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(editMode ? onEdit : onSubmit)}>
        <fieldset disabled={isSubmitting} className="group space-y-8">
          <FormField
            control={form.control}
            name="label"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Label Alamat</FormLabel>
                <FormControl>
                  <Input placeholder="Label alamat" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Penerima</FormLabel>
                <FormControl>
                  <Input placeholder="Nama penerima" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nomor HP</FormLabel>
                <FormControl>
                  <Input placeholder="Nomor HP" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div
            tabIndex={-1}
            onFocus={() => setCityDistrictFocus(true)}
            onBlur={(event) => {
              // Check if the related target is a child of the div
              if (
                postalCode.length < 5 ||
                event.currentTarget.contains(event.relatedTarget)
              )
                return
              setCityDistrictFocus(false)
            }}
          >
            <FormField
              control={form.control}
              name="city_district"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kota & Kecamatan</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="(Ketik minimal 3 huruf untuk mencari kota/kabupaten & kecamatan)"
                      {...field}
                      value={cityDistrictQuery}
                      onChange={(event) => {
                        setCityDistrictQuery(event.target.value)
                        setCityDistrictSelected(null)
                        if (event.target.value.length < 3) {
                          setCityDistrictResultSucess(false)
                          field.onChange("")
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                  <div
                    className={cn(
                      "border rounded-md mt-[8px!important] py-4 text-sm",
                      !cityDistrictFocus && " hidden"
                    )}
                  >
                    <div
                      className={cn(
                        "flex flex-col gap-4",
                        cityDistrictSelected && " hidden"
                      )}
                    >
                      <span className="px-6">
                        Untuk mempersingkat waktu, isi dengan nama kecamatan
                        Anda
                      </span>
                      <div
                        className={cn(
                          "flex flex-wrap gap-2 px-6",
                          cityDistrictResultSucess && " hidden"
                        )}
                      >
                        {city.map((item, index) => (
                          <span
                            key={index}
                            onClick={() => {
                              setCityDistrictQuery(item)
                            }}
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors border hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 cursor-pointer"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                      <div
                        className={cn(
                          "flex flex-col gap-2 pt-4 px-6 border-t-[1px]",
                          !cityDistrictResultSucess && " hidden"
                        )}
                      >
                        {cityDistrictResult?.map((item, index) => (
                          <span
                            key={index}
                            onClick={() => {
                              field.onChange(item.name)
                              selectCityDistrict(item.name, item.id)
                            }}
                            className="whitespace-nowrap rounded-md text-sm font-medium transition-colors border hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 cursor-pointer"
                          >
                            {item.name}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div
                      className={cn(
                        "flex flex-col gap-4",
                        !cityDistrictSelected && " hidden"
                      )}
                    >
                      <div className="flex flex-col gap-4 px-6">
                        <FormField
                          control={form.control}
                          name="postal_code"
                          render={({ field: field_postal_code }) => (
                            <FormItem>
                              <FormLabel>Postal Code</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Postal Code"
                                  {...field_postal_code}
                                  value={postalCode}
                                  onChange={(e) => {
                                    field_postal_code.onChange(e.target.value)
                                    setPostalCode(e.target.value)
                                  }}
                                />
                              </FormControl>
                              <FormDescription>
                                Silakan pilih atau tulis kode posmu jika belum
                                tercantum
                              </FormDescription>
                              <FormMessage />
                              <div className="flex flex-wrap gap-2">
                                {postalCodeResult?.map((item, index) => (
                                  <Button key={index} variant="outline" asChild>
                                    <span
                                      onClick={() => {
                                        field_postal_code.onChange(
                                          item.postal_code?.toString()
                                        )
                                        field.onChange(item.name)
                                        setCityDistrictQuery(item.name)
                                        setPostalCode(
                                          item.postal_code?.toString() || ""
                                        )
                                        setCityDistrictFocus(false)
                                      }}
                                      className="whitespace-nowrap rounded-md text-sm font-medium transition-colors border hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 cursor-pointer"
                                    >
                                      {item.postal_code}
                                    </span>
                                  </Button>
                                ))}
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alamat lengkap</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ketikkan alamat lengkapmu disini yaa"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Catatan untuk kurir (opsional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Catatan untuk kurir (opsional)"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription>
                  Warna rumah, patokan, pesan khusus, dll.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2">
            <SubmitButton
              submit={isSubmitting}
              text={editMode ? "Simpan perubahan" : "Tambahkan alamat"}
            />
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Batalkan
              </Button>
            </DialogClose>
          </div>
        </fieldset>
      </form>
    </Form>
  )
}
