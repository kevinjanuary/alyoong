"use client"

import { Search } from "lucide-react"
import { Input } from "./ui/input"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

const SearchField = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [query, setQuery] = useState(
    searchParams.get("query")?.toString() || ""
  )

  return (
    <div className="relative">
      <form
        onSubmit={(e) => {
          e.preventDefault()

          const keywords = query.trim()
          const params = new URLSearchParams(searchParams)

          if (keywords) {
            params.set("query", keywords)
            params.delete("category")
          } else {
            params.delete("query")
          }

          router.push(`/products?${params.toString()}`)
        }}
      >
        <Input
          type="text"
          placeholder="Mau cari apa hari ini?"
          className="pl-10"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>
      <Search size={16} className="absolute top-3 left-3" />
    </div>
  )
}

export default SearchField
