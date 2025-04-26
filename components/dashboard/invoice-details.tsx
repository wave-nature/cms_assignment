"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EditInvoiceDialog } from "@/components/dashboard/edit-invoice-dialog";
import { DeleteConfirmationDialog } from "@/components/dashboard/delete-confirmation-dialog";
import { InvoiceAuditLog } from "./invoice-audit-log";
import { Spinner } from "../ui/spinner";
import toast from "react-hot-toast";

interface InvoiceDetailsProps {
  customerId: string;
  invoiceId: string;
}

export function InvoiceDetails({ customerId, invoiceId }: InvoiceDetailsProps) {
  const [loading, setLoading] = useState(false);
  const [invoice, setInvoice] = useState<any>({});
  const [refresh, setRefresh] = useState<boolean>(false);

  const fetchInvoice = async (id: string) => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/admin/invoices/${id}`);

      const invoice = res.data?.payload?.invoice;
      if (invoice) {
        setInvoice(invoice);
      }
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!invoiceId) return;
    fetchInvoice(invoiceId);
  }, [refresh]);

  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    const toastId = toast.loading("Deleting invoice...");
    try {
      const res = await axios.delete(`/api/admin/invoices/${invoiceId}`);
      if (res.status === 200) {
        toast.dismiss(toastId);
        toast.success("Invoice deleted successfully!");
        router.push(`/dashboard/customer/${customerId}`);
      }
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Error while deleting invoice, please try again later.");
    } finally {
      setLoading(false);
      toast.dismiss(toastId);
    }
  };

  if (loading) return <Spinner />;

  return (
    <>
      {/* invoice data */}
      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <CardTitle>Invoice #{invoice.id}</CardTitle>
          <div className="flex gap-2">
            {invoice?.id ? (
              <EditInvoiceDialog
                invoice={invoice}
                setRefresh={setRefresh}
                refresh={refresh}
              />
            ) : null}
            <DeleteConfirmationDialog
              title="Delete Invoice"
              description="Are you sure you want to delete this invoice? This action cannot be undone and it will delete logs for this invoice too."
              onDelete={async () => await handleDelete()}
              loading={loading}
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
                      invoice.status === "Paid"
                        ? "default"
                        : invoice.status === "Pending"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {invoice.status}
                  </Badge>
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium leading-none">
                  Invoice Date
                </h3>
                <p className="text-sm text-muted-foreground">
                  {invoice?.invoiceDate
                    ? format(invoice.invoiceDate, "PPP")
                    : null}
                </p>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium leading-none">Due Date</h3>
                <p className="text-sm text-muted-foreground">
                  {invoice?.dueDate ? format(invoice.dueDate, "PPP") : null}
                </p>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium leading-none">
                  External ID
                </h3>
                <p className="text-sm text-muted-foreground">
                  {"INV_" +
                    (parseInt(invoice.externalInvoiceId) < 10
                      ? "0" + invoice.externalInvoiceId
                      : invoice.externalInvoiceId)}
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-medium leading-none">Description</h3>
              <p className="text-sm text-muted-foreground">
                {invoice.description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* logs */}
      <InvoiceAuditLog invoiceId={invoiceId} refresh={refresh} />
    </>
  );
}
