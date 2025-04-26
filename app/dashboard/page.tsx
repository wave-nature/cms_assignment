import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardCards } from "@/components/dashboard/dashboard-cards"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { InvoiceStatusChart } from "@/components/dashboard/invoice-status-chart"
import { RecentCustomers } from "@/components/dashboard/recent-customers"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Overview of your business",
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader heading="Dashboard" text="Overview of your business metrics and activity" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCards />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <RevenueChart />
        <InvoiceStatusChart />
      </div>
      <RecentCustomers />
    </div>
  )
}
