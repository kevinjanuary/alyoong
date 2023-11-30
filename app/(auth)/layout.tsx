const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full bg-slate-100 flex flex-col">
      <main className="pt-8 pb-20 bg-slate-100 grow">{children}</main>
    </div>
  )
}

export default AuthLayout
