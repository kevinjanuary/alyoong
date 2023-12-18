import Image from "next/image"
import Link from "next/link"

const Logo = () => {
  return (
    <Link href="/">
      <div className="flex gap-2 items-center">
        <Image
          src="/logo.png"
          alt="Alyoong"
          width={160}
          height={35}
          className="h-[35px]"
        />
      </div>
    </Link>
  )
}

export default Logo
