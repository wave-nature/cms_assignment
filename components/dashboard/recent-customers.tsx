"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Sample data
const customers = [
  {
    id: "1",
    name: "Acme Inc.",
    email: "info@acme.com",
    status: "active",
    invoiceCount: 12,
    totalSpent: 24500,
  },
  {
    id: "2",
    name: "Globex Corporation",
    email: "contact@globex.com",
    status: "active",
    invoiceCount: 8,
    totalSpent: 18750,
  },
  {
    id: "3",
    name: "Soylent Corp",
    email: "hello@soylent.com",
    status: "inactive",
    invoiceCount: 5,
    totalSpent: 9200,
  },
  {
    id: "4",
    name: "Initech",
    email: "support@initech.com",
    status: "active",
    invoiceCount: 15,
    totalSpent: 32100,
  },
  {
    id: "5",
    name: "Umbrella Corporation",
    email: "info@umbrella.com",
    status: "active",
    invoiceCount: 10,
    totalSpent: 21300,
  },
]

export function RecentCustomers() {
  const [page, setPage] = useState(1)
  const pageSize = 5
  const totalPages = Math.ceil(customers.length / pageSize)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Customers</CardTitle>
        <CardDescription>Your most recent customer activity</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Invoices</TableHead>
              <TableHead className="text-right">Total Spent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.slice((page - 1) * pageSize, page * pageSize).map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">
                  <Link href={`/dashboard/customer/${customer.id}`} className="hover:underline">
                    {customer.name}
                  </Link>
                </TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>
                  <Badge variant={customer.status === "active" ? "default" : "secondary"}>{customer.status}</Badge>
                </TableCell>
                <TableCell>{customer.invoiceCount}</TableCell>
                <TableCell className="text-right">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(customer.totalSpent)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button variant="outline" size="sm" onClick={() => setPage(page > 1 ? page - 1 : 1)} disabled={page === 1}>
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page < totalPages ? page + 1 : totalPages)}
            disabled={page === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
