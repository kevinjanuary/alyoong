"use client"

import { Search } from "lucide-react"
import { Input } from "./ui/input"
import { useState } from "react"
import { useRouter } from "next/navigation"

const SearchField = () => {
  const [query, setQuery] = useState("")
  const router = useRouter()

  return (
    <div className="relative">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (!query.trim()) return
          router.push(`/search/${query}`)
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
