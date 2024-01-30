import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { db } from "@/lib/prismadb"
import { getCurrentUser } from "@/lib/session"
import { redirect } from "next/navigation"
import { EditProductForm } from "./_components/edit-product"

const EditProductPage = async ({
  params,
}: {
  params: {
    productId: string
  }
}) => {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect("/login")
  }

  const product = await db.product.findUnique({
    where: {
      id: params.productId,
      userId: currentUser.id,
    },
  })
  if (!product) {
    redirect("/dashboard/products")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ubah produk</CardTitle>
        <CardDescription>
          Buat detail produk se-sesuai mungkin dengan barang yang akan dijual
        </CardDescription>
      </CardHeader>
      <CardContent>
        <EditProductForm product={product} />
      </CardContent>
    </Card>
  )
}

export default EditProductPage
