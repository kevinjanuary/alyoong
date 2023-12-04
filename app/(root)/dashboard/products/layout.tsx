import { PageHeading } from "../_components/page-heading"

const ProductsLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <>
      <PageHeading title="Products" subtitle="Manage your products" />
      {children}
    </>
  )
}

export default ProductsLayout
