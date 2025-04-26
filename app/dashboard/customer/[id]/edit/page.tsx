import type { Metadata } from "next";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { CustomerForm } from "@/components/dashboard/customer-form";

export const metadata: Metadata = {
  title: "Add Customer",
  description: "Add a new customer to your database",
};

export default async function EditCustomerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  return (
    <div className="space-y-6">
      <DashboardHeader heading="Edit Customer" text="Update customer record" />
      <CustomerForm id={id} />
    </div>
  );
}
