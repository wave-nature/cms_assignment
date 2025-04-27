import prisma from "@prisma/index";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

import { createError, createResponse } from "@/utils/responseutils";
import messages from "@/utils/messages";
import validation from "./validation";
import { isAdmin } from "@/utils/helpers";

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const admin = await isAdmin(request);
  if (!admin) {
    createError({
      message: messages.UNAUTHORIZED,
    });
  }

  // Validate
  const id = (await params).id;
  // Get invoice
  const invoice = await prisma.invoice.findFirst({
    where: {
      id,
    },
  });

  if (!invoice) {
    return createError({
      message: messages.NOT_FOUND,
    });
  }

  return createResponse({
    message: messages.SUCCESS,
    payload: { invoice },
  });
};

export const PATCH = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const admin: any = await isAdmin(request);
  if (!admin) {
    createError({
      message: messages.UNAUTHORIZED,
    });
  }

  // Validate the request body against the schema
  const { error, value } = validation.patch.validate(await request.json());
  if (error) {
    return createError({
      message: messages.VALIDATION_ERROR,
      payload: error.details,
    });
  }
  const id = (await params).id;
  const { amount, status, dueDate, invoiceDate, description, fieldChanged } =
    value;

  // Check if the invoice already exists
  const invoice = await prisma.invoice.findFirst({
    where: {
      id,
    },
  });
  if (!invoice) {
    return createError({
      message: messages.NOT_FOUND,
    });
  }

  // update the invoice
  let data: any = {
    amount,
    status,
    dueDate,
    invoiceDate,
    description,
    ownerId: invoice.ownerId,
  };

  const updatedInvoice = await prisma.invoice.update({
    where: {
      id,
    },
    data,
  });

  if (fieldChanged) {
    const log = await prisma.invoiceLogs.create({
      data: {
        invoiceId: id,
        fieldChanged: fieldChanged,
        adminId: admin?.id,
        changedAt: new Date(),
        action: "Update",
      },
    });
  }

  return createResponse({
    message: messages.SUCCESS,
    payload: { invoice: updatedInvoice },
  });
};

export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const token = await getToken({ req: request });
  const id = (await params).id;

  if (!token) {
    return createError({
      message: messages.UNAUTHORIZED,
    });
  }

  // Get all invoice
  const invoice = await prisma.invoice.findFirst({
    where: { id },
  });

  if (!invoice) {
    return createError({
      message: messages.NOT_FOUND,
    });
  }

  // delete all logs related to this invoice
  await prisma.invoiceLogs.deleteMany({
    where: { invoiceId: id },
  });
  await prisma.invoice.delete({ where: { id } });

  return createResponse({
    message: messages.SUCCESS,
    payload: {},
  });
};
