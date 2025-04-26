"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { EditInvoiceDialog } from "@/components/dashboard/edit-invoice-dialog"
import { DeleteConfirmationDialog } from "@/components/dashboard/delete-confirmation-dialog"
import { useRouter } from "next/navigation"

interface InvoiceDetailsProps {
  customerId: string
  invoiceId: string
}

export function InvoiceDetails({ customerId, invoiceId }: InvoiceDetailsProps) {
  // This would fetch invoice data in a real implementation
  const invoice = {
    id: invoiceId,
    amount: 1250.0,
    status: "paid",
    date: "2023-03-15",
    dueDate: "2023-04-15",
    description: "Monthly service subscription",
    externalId: "EXT-INV-001",
    items: [
      { id: 1, description: "Basic Plan", quantity: 1, unitPrice: 1000.0, total: 1000.0 },
      { id: 2, description: "Support Add-on", quantity: 1, unitPrice: 250.0, total: 250.0 },
    ],
  }

  const router = useRouter()

  const handleDelete = () => {
    // In a real implementation, you would redirect after successful deletion
    router.push(`/dashboard/customer/${customerId}`)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <CardTitle>Invoice #{invoice.id}</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
            <span className="sr-only">Download</span>
          </Button>
          <EditInvoiceDialog invoice={invoice} />
          <DeleteConfirmationDialog
            title="Delete Invoice"
            description="Are you sure you want to delete this invoice? This action cannot be undone."
            onDelete={handleDelete}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <h3 className="text-sm font-medium leading-none">Amount</h3>
              <p className="text-sm font-bold">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(invoice.amount)}
              </p>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-medium leading-none">Status</h3>
              <div>
                <Badge
                  variant={
                    invoice.status === "paid" ? "default" : invoice.status === "pending" ? "secondary" : "destructive"
                  }
                >
                  {invoice.status}
                </Badge>
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-medium leading-none">Invoice Date</h3>
              <p className="text-sm text-muted-foreground">{invoice.date}</p>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-medium leading-none">Due Date</h3>
              <p className="text-sm text-muted-foreground">{invoice.dueDate}</p>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-medium leading-none">External ID</h3>
              <p className="text-sm text-muted-foreground">{invoice.externalId}</p>
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-medium leading-none">Description</h3>
            <p className="text-sm text-muted-foreground">{invoice.description}</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium leading-none">Line Items</h3>
            <div className="rounded-md border">
              <table className="min-w-full divide-y divide-border">
                <thead>
                  <tr className="divide-x divide-border">
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Description</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Quantity</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Unit Price</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {invoice.items.map((item) => (
                    <tr key={item.id} className="divide-x divide-border">
                      <td className="px-4 py-3 text-sm">{item.description}</td>
                      <td className="px-4 py-3 text-sm">{item.quantity}</td>
                      <td className="px-4 py-3 text-sm">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(item.unitPrice)}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="divide-x divide-border">
                    <td colSpan={3} className="px-4 py-3 text-sm font-medium text-right">
                      Total
                    </td>
                    <td className="px-4 py-3 text-sm font-bold">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(invoice.amount)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
