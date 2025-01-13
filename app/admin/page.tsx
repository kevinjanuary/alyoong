import { FirstChart } from "./_components/charts"
import { FourthChart } from "./_components/fourth-charts"
import { SecondChart } from "./_components/second-charts"
import { ThirdChart } from "./_components/third-charts"

const AdminDashboard = async () => {
  return (
    <div className="space-y-4">
      <FirstChart />

      <div className="grid-cols-3 grid gap-4">
        <SecondChart />
        <ThirdChart />
        <FourthChart />
      </div>
    </div>
  )
}

export default AdminDashboard
