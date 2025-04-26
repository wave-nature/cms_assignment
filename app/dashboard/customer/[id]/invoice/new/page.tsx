import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { InvoiceForm } from "@/components/dashboard/invoice-form"

export const metadata: Metadata = {
  title: "Create Invoice",
  description: "Create a new invoice for a customer",
}

export default function NewInvoicePage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <DashboardHeader heading="Create Invoice" text="Create a new invoice for this customer" />
      <InvoiceForm customerId={params.id} />
    </div>
  )
}
