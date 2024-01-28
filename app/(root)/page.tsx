import { Button } from "@/components/ui/button"
import Link from "next/link"
import Categories from "./_components/categories"
import Products from "./_components/products"
import { getSession } from "@/lib/session"

const RootPage = async () => {
  const session = await getSession()

  return (
    <div className="flex flex-col mt-32">
      <div className="flex flex-col items-center">
        <h1 className="text-3xl md:text-6xl font-semibold text-center mb-6 max-w-xs md:max-w-4xl">
          Jual barang lama dan temukan barang baru impianmu!
        </h1>
        <span className="text-sm md:text-xl text-neutral-400 max-w-xs md:max-w-4xl text-center">
          Temukan kualitas baru dalam barang bekas di Alyoong!
        </span>
        <div className="flex gap-4 mt-6">
          <Button type="button" size="lg" asChild>
            <Link href="/products">Shop Now</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href={session?.user ? "/dashboard/products" : "/register"}>
              Sell Now
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-center mt-24">
        <h2 className="text-2xl md:text-4xl font-medium text-center mb-6 max-w-xs md:max-w-4xl">
          Kategori
        </h2>
        <span className="text-sm md:text-xl text-neutral-400 max-w-xs md:max-w-4xl text-center">
          Temukan barang berdasarkan kategori yang kamu inginkan!
        </span>
        <Categories />
      </div>

      <div className="flex flex-col items-center mt-24">
        <h2 className="text-2xl md:text-4xl font-medium text-center mb-6 max-w-xs md:max-w-4xl">
          Produk Terbaru
        </h2>
        <span className="text-sm md:text-xl text-neutral-400 max-w-xs md:max-w-4xl text-center">
          Cari barang impianmu di Alyoong!
        </span>
        <div className="max-w-5xl">
          <Products limit={10} />
        </div>
        <Button type="button" className="mt-8" asChild>
          <Link href="/products">Lihat lebih banyak</Link>
        </Button>
      </div>
    </div>
  )
}

export default RootPage
