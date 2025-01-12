import { Button } from "@/components/ui/button"
import { currencyFormat } from "@/lib/currencyFormat"
import { db } from "@/lib/prismadb"
import { imageLoader } from "@/lib/utils-client"
import Image from "next/image"
import Link from "next/link"

const ProductsCatalogPage = async ({
  searchParams,
}: {
  searchParams?: {
    query?: string
    category?: string
  }
}) => {
  const categories = await db.product.groupBy({
    by: ["category"],
    _count: {
      id: true,
    },
    orderBy: {
      _count: {
        id: "desc",
      },
    },
  })

  const max8Categories = categories.slice(0, 8)

  const query =
    searchParams && searchParams.query
      ? decodeURIComponent(searchParams.query)
      : undefined

  const products = await db.product.findMany({
    where: {
      name: {
        search: query,
      },
      category: query
        ? {
            search: query,
          }
        : searchParams?.category,
      description: {
        search: query,
      },
    },
    include: {
      user: {
        select: {
          addresses: {
            where: {
              primary: true,
            },
            take: 1,
            select: {
              city: true,
            },
          },
        },
      },
    },
    orderBy: [
      {
        stock: "desc",
      },
      {
        createdAt: "desc",
      },
      {
        _relevance: query
          ? {
              fields: ["name", "category", "description"],
              search: query,
              sort: "desc",
            }
          : undefined,
      },
    ],
  })

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <h2 className="text-2xl font-medium">Daftar Produk</h2>

      {query && (
        <span>
          Menampilkan {products.length} barang untuk &quot;{query}&quot;
        </span>
      )}

      <div className="grid grid-cols-[200px_auto] items-start gap-4">
        <div className="border rounded-md p-4">
          <Button size="sm" className="mb-2 w-full" asChild>
            <Link href="/products">Hapus Filter</Link>
          </Button>

          <div>Kategori</div>
          <div className="flex flex-col gap-1 text-sm">
            {max8Categories.map((category) => (
              <Link
                key={category.category}
                href={`/products?category=${category.category}`}
                className="text-muted-foreground hover:text-primary flex items-center justify-between gap-1"
              >
                <span>{category.category}</span>
                <span className="border h-4 w-4 flex items-center justify-center rounded-full text-xs">
                  {category._count.id}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="w-full h-full">
          <div className="grid grid-cols-5 gap-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="border rounded-lg shadow-sm overflow-hidden"
              >
                <Link
                  href={`/products/${product.id}`}
                  className="h-full flex flex-col"
                >
                  <div className="relative">
                    <Image
                      loader={imageLoader}
                      src={product.images}
                      alt={product.name}
                      width={200}
                      height={200}
                      className="w-full aspect-square object-cover"
                    />
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white text-lg font-semibold">
                          Stok Habis
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="bg-white px-2 pt-3 pb-4 flex flex-col text-sm gap-0.5 grow">
                    <h1 className="line-clamp-2">{product.name}</h1>
                    <span className="font-semibold">
                      Rp{currencyFormat(Number(product.price))}
                    </span>
                    <span className="text-xs text-neutral-500">
                      {product.user.addresses[0].city}
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {!products.length && (
            <div className="max-w-2xl mx-auto h-full flex items-center justify-center text-center">
              <div className="flex flex-col gap-4">
                <h5 className="text-2xl font-semibold">
                  Tidak ada barang ૮(˶ㅠ︿ㅠ)ა
                </h5>
                <span className="text-neutral-500">
                  Tidak ada barang yang ditemukan.
                </span>

                <span className="text-neutral-500">
                  Coba cari barang yang lain...
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductsCatalogPage
