import { PageHeading } from "../_components/page-heading"

const ProductsLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <>
      <PageHeading title="Produk" subtitle="Kelola produk Anda" />
      {children}
    </>
  )
}

export default ProductsLayout
