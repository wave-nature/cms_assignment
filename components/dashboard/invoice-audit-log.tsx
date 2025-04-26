"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { useEffect, useState } from "react";
import { Spinner } from "../ui/spinner";
import { Button } from "../ui/button"; // Assuming you have a Button component

interface InvoiceAuditLogProps {
  invoiceId: string;
  refresh: boolean;
}

export function InvoiceAuditLog({ invoiceId, refresh }: InvoiceAuditLogProps) {
  const [loading, setLoading] = useState(false);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [totalLogs, setTotalLogs] = useState<number>(0);

  const totalPages = Math.ceil(totalLogs / pageSize);

  const fetchInvoiceLogs = async (id: string, pageNumber = 1) => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/admin/invoices/${id}/logs`, {
        params: {
          page: pageNumber,
          pageSize,
        },
      });

      const { payload, pagination } = res.data;
      if (payload) {
        setAuditLogs(payload.logs || []);
        setTotalLogs(pagination.Total || 0);
      }
    } catch (error) {
      console.error("Failed to fetch invoice logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!invoiceId) return;
    fetchInvoiceLogs(invoiceId, page);
  }, [invoiceId, refresh, page]);

  if (loading) return <Spinner />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Audit Log</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {auditLogs.length > 0 ? (
            <div className="rounded-md border overflow-auto">
              <table className="min-w-full divide-y divide-border">
                <thead>
                  <tr className="divide-x divide-border">
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                      Timestamp
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                      Fields Changed
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                      Updated By
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {auditLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="divide-x divide-border align-top"
                    >
                      <td className="px-4 py-3 text-sm">
                        {new Date(log.changedAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="space-y-2">
                          {Object.entries(log.fieldChanged).map(
                            ([fieldName, values]: any) => (
                              <div key={fieldName} className="flex flex-col">
                                <span className="font-semibold capitalize">
                                  {fieldName}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {values.prevValue} ➔ {values.newValue}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {log?.admin?.email || "System"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="flex items-center justify-between px-4 py-3 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, totalPages))
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No audit logs found for this invoice.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
