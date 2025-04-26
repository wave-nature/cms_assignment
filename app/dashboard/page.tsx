"use client";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardCards } from "@/components/dashboard/dashboard-cards";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { InvoiceStatusChart } from "@/components/dashboard/invoice-status-chart";
import PageLoader from "@/components/ui/page-loader";
import axios from "axios";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState(true);

  async function getDashboardData() {
    setLoading(true);
    const res = await axios.get("/api/admin/dashboard");
    setLoading(false);
    setData(res.data?.payload);
  }

  useEffect(() => {
    getDashboardData();
  }, []);
  if (loading) return <PageLoader />;

  console.log("Dashboard Data: ", data);

  return (
    <div className="space-y-6">
      <DashboardHeader
        heading="Dashboard"
        text="Overview of your business metrics and activity"
      />
      <div className="grid gap-12 md:grid-cols-3 lg:grid-cols-3">
        <DashboardCards
          invoices={data?.invoices}
          customers={data?.customers}
          revenue={data?.totalRevenue}
        />
      </div>
      {data ? (
        <div className="grid gap-6 md:grid-cols-2">
          <RevenueChart
            data={data.monthlyRevenue}
            totalRevenue={data.totalRevenue}
          />
          <InvoiceStatusChart data={data.invoiceStatus} />
        </div>
      ) : null}
    </div>
  );
}
