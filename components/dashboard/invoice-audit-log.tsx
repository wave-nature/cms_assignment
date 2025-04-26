import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface InvoiceAuditLogProps {
  invoiceId: string
}

export function InvoiceAuditLog({ invoiceId }: InvoiceAuditLogProps) {
  // This would fetch audit log data in a real implementation
  const auditLogs = [
    {
      id: 1,
      timestamp: "2023-03-15T10:30:00Z",
      field: "status",
      previousValue: "pending",
      newValue: "paid",
      user: "John Doe",
    },
    {
      id: 2,
      timestamp: "2023-03-10T14:45:00Z",
      field: "amount",
      previousValue: "1200.00",
      newValue: "1250.00",
      user: "Jane Smith",
    },
    {
      id: 3,
      timestamp: "2023-03-05T09:15:00Z",
      field: "dueDate",
      previousValue: "2023-04-10",
      newValue: "2023-04-15",
      user: "John Doe",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Audit Log</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {auditLogs.length > 0 ? (
            <div className="rounded-md border">
              <table className="min-w-full divide-y divide-border">
                <thead>
                  <tr className="divide-x divide-border">
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Timestamp</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Field</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Previous Value</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">New Value</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">User</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="divide-x divide-border">
                      <td className="px-4 py-3 text-sm">{new Date(log.timestamp).toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm capitalize">{log.field}</td>
                      <td className="px-4 py-3 text-sm">{log.previousValue}</td>
                      <td className="px-4 py-3 text-sm">{log.newValue}</td>
                      <td className="px-4 py-3 text-sm">{log.user}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">No audit logs found for this invoice.</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
