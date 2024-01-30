"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TProductSchema, productSchema } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"
import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { currencyReformat } from "@/lib/currencyFormat"
import { cn } from "@/lib/utils"
import { SubmitButton } from "@/components/submit-button"
import type { Product } from "@prisma/client"
import { editProduct } from "@/actions/product"

export function EditProductForm({ product }: { product: Product }) {
  const [warranty, setWarranty] = useState(product.warranty === "Active")
  const [file, setFile] = useState<File>()
  const [image, setImage] = useState<string | ArrayBuffer | null | undefined>(
    product.images
  )
  const { toast } = useToast()
  const router = useRouter()
  const form = useForm<TProductSchema>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product.name,
      description: product.description,
      images: "",
      price: product.price.toString(),
      condition:
        product.condition === "Very good condition"
          ? "Very good condition"
          : product.condition === "Good condition"
          ? "Good condition"
          : "Judge by picture",
      stock: product.stock.toString(),
      weight: product.weight.toString(),
      length: product.length.toString(),
      width: product.width.toString(),
      height: product.height.toString(),
      warranty: product.warranty === "Active" ? "Active" : "No",
      warranty_detail: product.warranty_detail,
      category:
        product.category === "Monitor"
          ? "Monitor"
          : product.category === "Keyboard"
          ? "Keyboard"
          : product.category === "Mouse"
          ? "Mouse"
          : product.category === "Headset"
          ? "Headset"
          : product.category === "Webcam"
          ? "Webcam"
          : product.category === "Processor"
          ? "Processor"
          : product.category === "Motherboard"
          ? "Motherboard"
          : product.category === "Graphic Card"
          ? "Graphic Card"
          : product.category === "Power Supply"
          ? "Power Supply"
          : product.category === "Memory"
          ? "Memory"
          : product.category === "Disk"
          ? "Disk"
          : "Other",
      subcategory: product.subcategory,
    },
  })
  const isSubmitting = form.formState.isSubmitting

  async function onSubmit(values: TProductSchema) {
    try {
      let newImages = product.images

      if (file) {
        const data = new FormData()
        data.set("image", file)
        const response = await fetch("/api/images", {
          method: "POST",
          body: data,
        })

        if (!response.ok) throw "Upload images failed"
        const { images } = await response.json()
        newImages = images
      }

      const res = await editProduct(product.id, {
        ...values,
        images: newImages,
      })

      if (!res.success) throw "Add product failed. Please try again."

      toast({
        title: "Produk berhasil diubah.",
        description: "Berhasil mengubah detail produk.",
        duration: 2000,
      })

      router.push("/dashboard/products")
      router.refresh()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Produk gagal diubah.",
        description: error
          ? `${error}`
          : "Terjadi kesalahan saat mengubah produk.",
        duration: 2000,
      })
    }
  }

  async function uploadToClient(event: React.ChangeEvent<HTMLInputElement>) {
    if (
      event.target.files &&
      event.target.files[0] &&
      event.target.files[0].type.match("image.*")
    ) {
      const file = event.target.files[0]
      setFile(file)
      const reader = new FileReader()
      reader.onload = function (e) {
        setImage(e.target?.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Form {...form}>
      <fieldset disabled={isSubmitting} className="group">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-5 group-disabled:pointer-events-none"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Type product name here." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Type product description here."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid gap-6 grid-cols-2">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <div className="flex">
                    <FormLabel className="inline-flex items-center justify-center whitespace-nowrap rounded-s-md text-sm font-medium h-10 px-4 py-2 bg-slate-200 text-slate-700 opacity-100">
                      Rp
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Type product price here."
                        className="rounded-none rounded-r-md"
                        {...field}
                        onChange={(e) => {
                          field.onChange(currencyReformat(e.target.value))
                        }}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="condition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Condition</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select current product condition" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Very good condition">
                        Very good condition
                      </SelectItem>
                      <SelectItem value="Good condition">
                        Good condition
                      </SelectItem>
                      <SelectItem value="Judge by picture">
                        Judge by picture
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-6 grid-cols-2">
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Input product price here."
                      {...field}
                      onChange={(e) => {
                        field.onChange(
                          currencyReformat(e.target.value, 0, 100000)
                        )
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight</FormLabel>
                  <div className="flex">
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Input product weight in mg."
                        className="rounded-none rounded-l-md z-10"
                        {...field}
                        onChange={(e) => {
                          field.onChange(
                            currencyReformat(e.target.value, 0, 500000)
                          )
                        }}
                      />
                    </FormControl>
                    <FormLabel className="inline-flex items-center justify-center whitespace-nowrap rounded-r-md text-sm font-medium h-10 px-4 py-2 bg-slate-200 text-slate-700 opacity-100">
                      grams
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-4 grid-cols-3">
            <FormField
              control={form.control}
              name="length"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size (length)</FormLabel>
                  <div className="flex">
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Length"
                        className="rounded-none rounded-l-md z-10"
                        {...field}
                        onChange={(e) => {
                          field.onChange(
                            currencyReformat(e.target.value, 0, 1000)
                          )
                        }}
                      />
                    </FormControl>
                    <FormLabel className="inline-flex items-center justify-center whitespace-nowrap rounded-r-md text-sm font-medium h-10 px-4 py-2 bg-slate-200 text-slate-700 opacity-100">
                      cm
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="width"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size (width)</FormLabel>
                  <div className="flex">
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Width"
                        className="rounded-none rounded-l-md z-10"
                        {...field}
                        onChange={(e) => {
                          field.onChange(
                            currencyReformat(e.target.value, 0, 1000)
                          )
                        }}
                      />
                    </FormControl>
                    <FormLabel className="inline-flex items-center justify-center whitespace-nowrap rounded-r-md text-sm font-medium h-10 px-4 py-2 bg-slate-200 text-slate-700 opacity-100">
                      cm
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size (height)</FormLabel>
                  <div className="flex">
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Height"
                        className="rounded-none rounded-l-md z-10"
                        {...field}
                        onChange={(e) => {
                          field.onChange(
                            currencyReformat(e.target.value, 0, 1000)
                          )
                        }}
                      />
                    </FormControl>
                    <FormLabel className="inline-flex items-center justify-center whitespace-nowrap rounded-r-md text-sm font-medium h-10 px-4 py-2 bg-slate-200 text-slate-700 opacity-100">
                      cm
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className={cn("grid gap-6", warranty && " grid-cols-2")}>
            <FormField
              control={form.control}
              name="warranty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Warranty</FormLabel>
                  <Select
                    defaultValue={field.value}
                    onValueChange={(value) => {
                      field.onChange(value)
                      setWarranty(value === "Active" ? true : false)
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select current product condition" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {warranty && (
              <FormField
                control={form.control}
                name="warranty_detail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Warranty details</FormLabel>
                    <div className="flex">
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="How long.."
                          className="rounded-none rounded-l-md z-10"
                          {...field}
                          onChange={(e) => {
                            field.onChange(
                              currencyReformat(e.target.value, 0, 999)
                            )
                          }}
                        />
                      </FormControl>
                      <FormLabel className="inline-flex items-center justify-center whitespace-nowrap rounded-r-md text-sm font-medium h-10 px-4 py-2 bg-slate-200 text-slate-700 opacity-100">
                        months
                      </FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
          <div className="grid gap-6 grid-cols-2">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select product category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>PC Gears</SelectLabel>
                        <SelectItem value="Monitor">Monitor</SelectItem>
                        <SelectItem value="Keyboard">Keyboard</SelectItem>
                        <SelectItem value="Mouse">Mouse</SelectItem>
                        <SelectItem value="Headset">Headset</SelectItem>
                        <SelectItem value="Webcam">Webcam</SelectItem>
                      </SelectGroup>
                      <SelectGroup>
                        <SelectLabel>PC Components</SelectLabel>
                        <SelectItem value="Processor">Processor</SelectItem>
                        <SelectItem value="Motherboard">Motherboard</SelectItem>
                        <SelectItem value="Graphic Card">
                          Graphic Card
                        </SelectItem>
                        <SelectItem value="Power Supply">
                          Power Supply
                        </SelectItem>
                        <SelectItem value="Memory">Memory</SelectItem>
                        <SelectItem value="Disk">Disk</SelectItem>
                      </SelectGroup>
                      <SelectGroup>
                        <SelectLabel>Other Categories</SelectLabel>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subcategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sub-Category</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Input product sub-category (optional)."
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    {...field}
                    onChange={uploadToClient}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {image && (
            <div>
              <span className="text-xs text-muted-foreground">Preview</span>
              <Image
                src={image as string}
                alt="..."
                width={256}
                height={256}
                className="w-auto h-64 aspect-square object-contain border"
              />
            </div>
          )}
          <SubmitButton submit={isSubmitting} text="Add product" />
        </form>
      </fieldset>
    </Form>
  )
}
