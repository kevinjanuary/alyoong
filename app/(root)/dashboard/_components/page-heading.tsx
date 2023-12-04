import { Separator } from "@/components/ui/separator"

export function PageHeading({
  title,
  subtitle,
}: {
  title: string
  subtitle: string
}) {
  return (
    <div className="flex flex-col my-8">
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="text-gray-600 mb-4">{subtitle}</p>
      <Separator />
    </div>
  )
}
