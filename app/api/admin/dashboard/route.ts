import prisma from "@prisma/index";
import { NextRequest } from "next/server";

import { createError, createResponse } from "@/utils/responseutils";
import messages from "@/utils/messages";

export const GET = async (request: NextRequest) => {
  try {
    const [
      totalCustomers,
      totalInvoices,
      revenueData,
      statusCounts,
      overdueInvoices,
    ] = await Promise.all([
      prisma.customer.count(),
      prisma.invoice.count(),

      // Revenue per month
      prisma.invoice.groupBy({
        by: ["invoiceDate"],
        _sum: { amount: true },
      }),

      // Count per status
      prisma.invoice.groupBy({
        by: ["status"],
        _count: { _all: true },
      }),

      // Overdue invoices (count)
      prisma.invoice.count({
        where: { status: "Overdue" },
      }),
    ]);

    // Format revenueData: month wise
    const monthlyRevenueMap: Record<string, number> = {};
    for (const item of revenueData) {
      const month = item.invoiceDate.toLocaleString("default", {
        month: "short",
      }); // Jan, Feb etc.
      monthlyRevenueMap[month] =
        (monthlyRevenueMap[month] || 0) + (item._sum.amount || 0);
    }

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthlyRevenue = months.map((month) => ({
      name: month,
      revenue: monthlyRevenueMap[month] || 0,
    }));

    // Status counts
    const statusMap: Record<string, number> = {
      Paid: 0,
      Pending: 0,
      Overdue: 0,
    };
    for (const item of statusCounts) {
      statusMap[item.status] = item._count._all;
    }

    // Calculate total revenue
    const totalRevenue = revenueData.reduce(
      (sum, item) => sum + (item._sum.amount || 0),
      0
    );

    return createResponse({
      message: messages.SUCCESS,
      payload: {
        customers: totalCustomers,
        invoices: totalInvoices,
        totalRevenue,
        overdueInvoices,
        monthlyRevenue, // For Area chart
        invoiceStatus: statusMap, // For Bar chart
      },
    });
  } catch (error) {
    console.error(error);
    return createError({
      message: messages.ERROR,
    });
  }
};
