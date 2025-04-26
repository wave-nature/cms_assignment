import type { Metadata } from "next"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { CustomerDetails } from "@/components/dashboard/customer-details"
import { CustomerInvoices } from "@/components/dashboard/customer-invoices"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Customer Details",
  description: "View and manage customer details",
}

export default function CustomerPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <DashboardHeader heading="Customer Details" text="View and manage customer information">
        <Button asChild>
          <Link href={`/dashboard/customer/${params.id}/invoice/new`}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Invoice
          </Link>
        </Button>
      </DashboardHeader>
      <CustomerDetails id={params.id} />
      <CustomerInvoices customerId={params.id} />
    </div>
  )
}
