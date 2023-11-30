import { deleteUser } from "@/actions/delete-user"
import { Button } from "@/components/ui/button"

interface UserProps {
  id: string
  name: string
  email: string
}

export const User = ({ id, name, email }: UserProps) => {
  const deleteUserWithId = deleteUser.bind(null, id)
  return (
    <form action={deleteUserWithId} className="flex items-center gap-x-2">
      <div>
        {id} - {name} - {email}
      </div>
      <Button type="submit" variant="destructive" size="sm">
        Delete
      </Button>
    </form>
  )
}
