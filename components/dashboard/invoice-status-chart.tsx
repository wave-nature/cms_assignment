"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const options = {
  indexAxis: "y" as const, // horizontal bar
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: function (context: any) {
          return `${context.raw}%`;
        },
      },
    },
  },
  scales: {
    x: {
      min: 0,
      max: 100,
      ticks: {
        callback: function (value: any) {
          return `${value}%`;
        },
        color: "#6B7280",
      },
      grid: {
        color: "#E5E7EB",
      },
    },
    y: {
      ticks: {
        color: "#6B7280",
      },
      grid: {
        display: false,
      },
    },
  },
};

interface InvoiceStatusChartProps {
  data: {
    Paid: number;
    Pending: number;
    Overdue: number;
  };
}

export function InvoiceStatusChart({ data }: InvoiceStatusChartProps) {
  const chartData = {
    labels: ["Paid", "Pending", "Overdue"],
    datasets: [
      {
        label: "Invoice Status",
        data: [data.Paid, data.Pending, data.Overdue],
        backgroundColor: ["#4ade80", "#facc15", "#f87171"], // Green, Yellow, Red
        borderWidth: 1,
        borderRadius: 8,
        barThickness: 40,
      },
    ],
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice Status</CardTitle>
        <CardDescription>Distribution of invoice statuses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <Bar data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
