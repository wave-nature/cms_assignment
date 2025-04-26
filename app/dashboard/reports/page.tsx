import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ReportsOverview } from "@/components/dashboard/reports-overview"

export const metadata: Metadata = {
  title: "Reports",
  description: "View financial reports and analytics",
}

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader heading="Reports" text="View financial reports and analytics" />
      <ReportsOverview />
    </div>
  )
}
