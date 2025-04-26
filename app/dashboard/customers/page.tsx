import type { Metadata } from "next"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { CustomerList } from "@/components/dashboard/customer-list"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Customers",
  description: "Manage your customers",
}

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader heading="Customers" text="View and manage your customer base">
        <Button asChild>
          <Link href="/dashboard/customers/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Customer
          </Link>
        </Button>
      </DashboardHeader>
      <CustomerList />
    </div>
  )
}
