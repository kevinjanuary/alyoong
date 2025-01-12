import Image from "next/image"
import Link from "next/link"

const Footer = () => {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-5xl w-full mx-auto px-4 py-10 flex flex-col items-center gap-4">
        <div className="w-[200px] h-[44px]">
          <Image
            src="/logo.png"
            alt="Alyoong"
            width={200}
            height={44}
            className="mb-4"
            unoptimized
          />
        </div>

        <div className="flex gap-4 text-xs text-gray-400">
          <Link href="#">Kebijakan Privasi</Link>
          <Link href="#">Syarat Layanan</Link>
          <Link href="#">Tentang Kami</Link>
          <Link href="#">Hubungi Kami</Link>
          <Link href="#">Pusat Bantuan</Link>
        </div>

        {/* masukkan detail copyright dan sebagainya dibawah ini */}
        <p className="text-xs text-gray-400 text-center">
          Alyoong is a marketplace or e-commerce platform based on Typescript.
          This platfrom use for buying and selling products that focuses on
          electronic products, whether new or second-hand. This platform was
          created with the purpose of completing a project assignment in college
          and was collaboratively worked on by a team of 5 people.
        </p>

        <p>
          <span className="text-xs text-gray-400">Dibuat dengan ❤️ oleh</span>{" "}
          <a
            href="https://www.instagram.com/theweekend.8oys/"
            className="text-xs"
          >
            theweekend.8oys
          </a>
        </p>

        <p className="text-xs text-gray-400">
          &copy; {new Date().getFullYear()} <Link href="/">Alyoong</Link>. All
          rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
