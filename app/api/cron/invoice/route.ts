import prisma from "@prisma/index";
import { NextRequest } from "next/server";

import { createResponse } from "@/utils/responseutils";
import messages from "@/utils/messages";
import { InvoiceStatus } from "@/lib/generated/prisma";

export const GET = async (request: NextRequest) => {
  // mark over due invoices as past due
  await prisma.invoice.updateMany({
    where: {
      status: InvoiceStatus.Overdue,
    },
    data: {
      status: InvoiceStatus.PastDue,
    },
  });

  // email all customers with pending invoices
  const pendingInvoices = await prisma.invoice.findMany({
    where: {
      status: InvoiceStatus.Pending,
    },
    include: {
      owner: true,
    },
  });

  // send email to all customers with pending invoices
  // we can use a third-party service like SendGrid or Nodemailer to send emails
  // for now, we will just log the emails to the console
  pendingInvoices.forEach((invoice) => {
    console.log(
      `Sending email to ${invoice.owner.email} for invoice ${invoice.externalInvoiceId}`
    );
  });

  return createResponse({
    message: messages.SUCCESS,
  });
};
