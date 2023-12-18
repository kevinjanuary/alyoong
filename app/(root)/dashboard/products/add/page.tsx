import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AddProductForm } from "./_components/add-product"
import { db } from "@/lib/prismadb"
import { getCurrentUser } from "@/lib/session"
import { redirect } from "next/navigation"

const AddProductPage = async () => {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/login")
  }

  const address = await db.address.findFirst({
    where: {
      userId: currentUser.id,
      primary: true,
    },
  })

  if (!address) {
    redirect("/dashboard/products")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add product</CardTitle>
        <CardDescription>Add a new product to your store</CardDescription>
      </CardHeader>
      <CardContent>
        <AddProductForm />
      </CardContent>
    </Card>
  )
}

export default AddProductPage
