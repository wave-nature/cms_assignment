import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { CustomerForm } from "@/components/dashboard/customer-form"

export const metadata: Metadata = {
  title: "Add Customer",
  description: "Add a new customer to your database",
}

export default function NewCustomerPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader heading="Add Customer" text="Create a new customer record" />
      <CustomerForm />
    </div>
  )
}
