import { rupiah } from "@/lib/currencyFormat"
import Image from "next/image"
import Link from "next/link"

type Product = {
  id: number
  title: string
  description: string
  price: number
  stock: number
  brand: string
  thumbnail: string
  images: string[]
}

const Products = async () => {
  const data = await fetch(
    "https://dummyjson.com/products/category/laptops?select=id,title,description,price,stock,brand,thumbnail,images"
  )
  const { products } = await data.json()

  return (
    <div className="max-w-5xl grid grid-cols-5 gap-3 mt-4">
      {products.map((product: Product) => (
        <div
          key={product.id}
          className="border rounded-lg shadow-sm overflow-hidden"
        >
          <Link
            href={`/products/${product.id}`}
            className="h-full flex flex-col"
          >
            <Image
              src={product.thumbnail}
              alt={product.title}
              width={200}
              height={200}
              className="w-full aspect-square object-cover"
            />
            <div className="bg-white px-2 pt-3 pb-4 flex flex-col text-sm gap-0.5 grow">
              <h1>{product.title}</h1>
              <span className="font-semibold">
                Rp{rupiah(product.price * 15000)}
              </span>
              <span className="text-xs text-neutral-500">Jakarta Pusat</span>
            </div>
          </Link>
        </div>
      ))}
    </div>
  )
}

export default Products
