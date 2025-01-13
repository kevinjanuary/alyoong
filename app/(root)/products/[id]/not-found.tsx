import Link from "next/link"

const ProductsNotFound = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-4">
      <h1 className="text-5xl font-semibold">404 (◞‸ ◟)💧</h1>
      <span className="text-xl font-semibold">Barang tidak ditemukan</span>
      <p className="text-neutral-500">
        Coba cari barang lainnya di <Link href="/products">halaman produk</Link>
        .
      </p>
    </div>
  )
}

export default ProductsNotFound
