"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EditCustomerDialog } from "@/components/dashboard/edit-customer-dialog"
import { DeleteConfirmationDialog } from "@/components/dashboard/delete-confirmation-dialog"
import { useRouter } from "next/navigation"

interface CustomerDetailsProps {
  id: string
}

export function CustomerDetails({ id }: CustomerDetailsProps) {
  // This would fetch customer data in a real implementation
  const customer = {
    id,
    name: "Acme Inc.",
    email: "info@acme.com",
    phone: "(555) 123-4567",
    address: "123 Main St, Anytown, USA",
    status: "active",
    externalId: "EXT-001",
    createdAt: "2023-01-15",
  }

  const router = useRouter()

  const handleDelete = () => {
    // In a real implementation, you would redirect after successful deletion
    router.push("/dashboard/customers")
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <CardTitle>{customer.name}</CardTitle>
        <div className="flex gap-2">
          <EditCustomerDialog customer={customer} />
          <DeleteConfirmationDialog
            title="Delete Customer"
            description="Are you sure you want to delete this customer? This action cannot be undone and will also delete all associated invoices."
            onDelete={handleDelete}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-1">
            <h3 className="text-sm font-medium leading-none">Email</h3>
            <p className="text-sm text-muted-foreground">{customer.email}</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium leading-none">Phone</h3>
            <p className="text-sm text-muted-foreground">{customer.phone}</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium leading-none">Address</h3>
            <p className="text-sm text-muted-foreground">{customer.address}</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium leading-none">Status</h3>
            <div>
              <Badge variant={customer.status === "active" ? "default" : "secondary"}>{customer.status}</Badge>
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium leading-none">External ID</h3>
            <p className="text-sm text-muted-foreground">{customer.externalId}</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium leading-none">Created</h3>
            <p className="text-sm text-muted-foreground">{customer.createdAt}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
