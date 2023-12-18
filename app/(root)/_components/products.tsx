import { currencyFormat } from "@/lib/currencyFormat"
import { db } from "@/lib/prismadb"
import Image from "next/image"
import Link from "next/link"

const Products = async () => {
  const products = await db.product.findMany({
    where: {
      stock: {
        gt: 0,
      },
    },
    take: 5,
  })

  return (
    <div className="max-w-5xl grid grid-cols-5 gap-3 mt-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="border rounded-lg shadow-sm overflow-hidden"
        >
          <Link
            href={`/products/${product.id}`}
            className="h-full flex flex-col"
          >
            <Image
              src={product.images}
              alt={product.name}
              width={200}
              height={200}
              className="w-full aspect-square object-cover"
            />
            <div className="bg-white px-2 pt-3 pb-4 flex flex-col text-sm gap-0.5 grow">
              <h1 className="line-clamp-2">{product.name}</h1>
              <span className="font-semibold">
                Rp{currencyFormat(Number(product.price))}
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
