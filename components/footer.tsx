import Link from "next/link"

const Footer = () => {
  return (
    <footer className="bg-white border-t">
      <div className="mx-auto py-10">
        <p className="text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} <Link href="/">Groovetech</Link>.
          All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
