import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { InvoiceDetails } from "@/components/dashboard/invoice-details"
import { InvoiceAuditLog } from "@/components/dashboard/invoice-audit-log"

export const metadata: Metadata = {
  title: "Invoice Details",
  description: "View and manage invoice details",
}

export default function InvoiceDetailsPage({
  params,
}: {
  params: { id: string; invoiceId: string }
}) {
  return (
    <div className="space-y-6">
      <DashboardHeader heading="Invoice Details" text="View and manage invoice information" />
      <InvoiceDetails customerId={params.id} invoiceId={params.invoiceId} />
      <InvoiceAuditLog invoiceId={params.invoiceId} />
    </div>
  )
}
