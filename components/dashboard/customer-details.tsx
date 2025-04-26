"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EditCustomerDialog } from "@/components/dashboard/edit-customer-dialog";
import { DeleteConfirmationDialog } from "@/components/dashboard/delete-confirmation-dialog";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { Spinner } from "../ui/spinner";
import toast from "react-hot-toast";

interface CustomerDetailsProps {
  id: string;
}

export function CustomerDetails({ id }: CustomerDetailsProps) {
  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState<any>({});
  const [refresh, setRefresh] = useState<boolean>(false);

  const fetchCustomer = async (id: string) => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/admin/customers/${id}`);

      const customer = res.data?.payload?.customer;
      if (customer) {
        setCustomer(customer);
      }
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchCustomer(id);
  }, [refresh]);

  const router = useRouter();

  const handleDelete = async () => {
    const toastId = toast.loading("Deleting customer...");
    try {
      const res = await axios.delete(`/api/admin/customers/${id}`);

      if (res.status === 200) {
        toast.dismiss(toastId);
        toast.success("Customer deleted successfully!");
        router.push("/dashboard/customers");
      }
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Error while deleting customer, please try again later.");
    } finally {
      toast.dismiss(toastId);
    }
  };

  if (loading) return <Spinner />;

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <CardTitle>{customer.fullName}</CardTitle>
        <div className="flex gap-2">
          <EditCustomerDialog
            customer={customer}
            setRefresh={setRefresh}
            refresh={refresh}
          />
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
              <Badge
                variant={customer.status === "active" ? "default" : "secondary"}
              >
                {customer.status ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium leading-none">External ID</h3>
            <p className="text-sm text-muted-foreground">
              {"CID_" + customer.externalCustomerId}
            </p>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium leading-none">Created</h3>
            <p className="text-sm text-muted-foreground">
              {customer.createdAt}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
