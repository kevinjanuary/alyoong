"use client"

import { useState } from "react"
import { Input, InputProps } from "./ui/input"
import { Eye, EyeOff } from "lucide-react"

export const InputPassword = ({ ...props }: InputProps) => {
  const [show, setShow] = useState(false)

  return (
    <div className="relative">
      <Input
        placeholder="********"
        type={show ? "text" : "password"}
        {...props}
      />
      <div
        className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
        onClick={() => setShow(!show)}
      >
        {show ? (
          <EyeOff className="text-muted-foreground" />
        ) : (
          <Eye className="text-muted-foreground" />
        )}
      </div>
    </div>
  )
}
