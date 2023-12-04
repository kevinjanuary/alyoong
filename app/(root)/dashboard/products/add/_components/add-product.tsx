"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
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
import { z } from "zod"
import { useToast } from "@/components/ui/use-toast"
import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { currencyReformat } from "@/lib/currencyFormat"
import { cn } from "@/lib/utils"

export function AddProductForm() {
  const [warranty, setWarranty] = useState(false)
  const [file, setFile] = useState<File>()
  const [image, setImage] = useState<string | ArrayBuffer | null | undefined>(
    null
  )
  const { toast } = useToast()
  const router = useRouter()
  const form = useForm<TProductSchema>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      images: "",
      price: "",
      condition: "Judge by picture",
      stock: "",
      weight: "",
      length: "",
      width: "",
      height: "",
      warranty: "No",
      warranty_detail: 1,
      category: "Other",
      subcategory: "",
    },
  })

  async function onSubmit(values: z.infer<typeof productSchema>) {
    try {
      if (!file) throw "No images file selected."
      const data = new FormData()
      data.set("image", file)
      const response = await fetch("/api/images", {
        method: "POST",
        body: data,
      })

      if (!response.ok) throw "Upload images failed"
      const { images } = await response.json()

      const res = await fetch("/api/products", {
        method: "POST",
        body: JSON.stringify({ ...values, images }),
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!res.ok) throw "Add product failed. Please try again."

      toast({
        title: "Product has added!",
        description: "Successfully added product.",
        duration: 2000,
      })

      router.push("/dashboard/products")
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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-5"
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
                      <SelectItem value="Graphic Card">Graphic Card</SelectItem>
                      <SelectItem value="Power Supply">Power Supply</SelectItem>
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
              width={50}
              height={50}
              className="w-auto h-64 aspect-square object-contain border"
            />
          </div>
        )}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
