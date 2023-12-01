import Footer from "@/components/footer"
import Navbar from "@/components/navbar"

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full flex flex-col">
      <Navbar />
      <main className="pt-8 pb-20 grow">{children}</main>
      <Footer />
    </div>
  )
}

export default RootLayout
