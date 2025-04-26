"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      labels: {
        color: "#6B7280", // text-gray-500
      },
    },
    tooltip: {
      callbacks: {
        label: function (context: any) {
          const value = context.raw;
          return `$${value.toLocaleString()}`;
        },
      },
    },
  },
  scales: {
    x: {
      ticks: {
        color: "#6B7280",
      },
      grid: {
        display: false,
      },
    },
    y: {
      ticks: {
        color: "#6B7280",
        callback: function (value: any) {
          return `$${value}`;
        },
      },
      grid: {
        color: "#E5E7EB", // light gray grid
      },
    },
  },
};

interface RevenueChartProps {
  data: { name: string; revenue: number }[];
  totalRevenue: number;
}

export function RevenueChart({ data, totalRevenue }: RevenueChartProps) {
  // Convert incoming data into chart.js format
  const chartData = {
    labels: data.map((item) => item.name),
    datasets: [
      {
        label: "Revenue",
        data: data.map((item) => item.revenue),
        fill: true,
        borderColor: "#6366F1", // Indigo-500
        backgroundColor: "rgba(99, 102, 241, 0.2)", // Light Indigo background
        tension: 0.4, // smooth curves
        pointBackgroundColor: "#6366F1",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#6366F1",
      },
    ],
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Trends</CardTitle>
        <CardDescription>
          Total Revenue: ${totalRevenue.toLocaleString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <Line data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
