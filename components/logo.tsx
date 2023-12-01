import Image from "next/image"
import Link from "next/link"

const Logo = () => {
  return (
    <Link href="/">
      <div className="flex gap-2 items-center">
        <Image src="/logo.svg" alt="Groovetech" width={50} height={50} />
        <span className="font-medium text-[#4845D2]">
          Groove
          <span className="text-[#A5B4FC]">tech</span>
        </span>
      </div>
    </Link>
  )
}

export default Logo
