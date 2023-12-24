import { Button } from "@/components/ui/button"
import Link from "next/link"

const ProductsNotFound = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-8">
      <h1 className="text-5xl font-semibold">404 :(</h1>
      <span className="text-3xl text-red-600">Product not found</span>
      <p className="text-xl">Please try again later...</p>
      <Button className="mt-8" asChild>
        <Link href="/">Back to Home</Link>
      </Button>
    </div>
  )
}

export default ProductsNotFound
