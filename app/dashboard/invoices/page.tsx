import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { InvoiceList } from "@/components/dashboard/invoice-list"

export const metadata: Metadata = {
  title: "Invoices",
  description: "Manage all invoices",
}

export default function InvoicesPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader heading="Invoices" text="View and manage all invoices" />
      <InvoiceList />
    </div>
  )
}
