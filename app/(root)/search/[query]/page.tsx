import { currencyFormat } from "@/lib/currencyFormat"
import { db } from "@/lib/prismadb"
import Image from "next/image"
import Link from "next/link"

const SearchPage = async ({
  params,
}: {
  params: {
    query: string
  }
}) => {
  const products = await db.product.findMany({
    where: {
      AND: [
        {
          stock: {
            gt: 0,
          },
        },
        {
          OR: [
            {
              name: {
                contains: params.query,
              },
            },
            {
              category: {
                contains: params.query,
              },
            },
            {
              description: {
                contains: params.query,
              },
            },
          ],
        },
      ],
    },
  })

  if (products.length === 0) {
    return (
      <div className="max-w-6xl mx-auto h-full flex items-center justify-center text-center">
        <div className="mt-4 flex flex-col">
          <h5 className="text-2xl font-semibold">{`Tidak ada barang :((`}</h5>
          <span className="text-neutral-500">
            Tidak ada barang yang cocok dengan kata kunci {`"${params.query}"`}.
          </span>

          <span className="text-neutral-500">
            Coba cari barang lainnya di{" "}
            <Link href="/products">halaman produk</Link>.
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-medium">
        Menampilkan {products.length} barang untuk
        <span>{` "${params.query}"`}</span>
      </h2>

      <div className="grid grid-cols-5 gap-3 mt-4">
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
    </div>
  )
}

export default SearchPage
