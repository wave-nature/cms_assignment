import prisma from "@prisma/index";
import { NextRequest } from "next/server";

import { convertURLSearchParamsToObject } from "@/utils/helpers";
import { createError, createResponse } from "@/utils/responseutils";
import messages from "@/utils/messages";
import validation from "./validation";

export const GET = async (request: NextRequest) => {
  // Validate
  const searchParams = request.nextUrl.searchParams;
  const { error, value } = validation.get.validate(
    convertURLSearchParamsToObject(searchParams)
  );
  if (error) {
    return createError({
      message: messages.VALIDATION_ERROR,
      payload: error.details,
    });
  }
  const { externalCustomerId, externalInvoiceId } = value;

  const customerId = parseInt(externalCustomerId.replace(/\D/g, ""), 10);
  const invoiceId = parseInt(externalInvoiceId.replace(/\D/g, ""), 10);

  // find customer
  const customer = await prisma.customer.findFirst({
    where: {
      externalCustomerId: customerId,
    },
  });

  if (!customer) {
    return createError({
      message: messages.CUSTOMER_NOT_FOUND,
    });
  }

  // find invoice
  const invoice = await prisma.invoice.findFirst({
    where: {
      externalInvoiceId: invoiceId,
      ownerId: customer.id,
    },
  });

  if (!invoice) {
    return createError({
      message: messages.INVOICE_NOT_FOUND,
    });
  }

  return createResponse({
    message: messages.SUCCESS,
    payload: { invoice },
  });
};

export const POST = async (request: Request) => {
  // Validate the request body against the schema
  const { error, value } = validation.post.validate(await request.json());
  if (error) {
    return createError({
      message: messages.VALIDATION_ERROR,
      payload: error.details,
    });
  }
  const {
    amount,
    status,
    dueDate,
    invoiceDate,
    description,
    externalCustomerId,
    externalInvoiceId,
  } = value;

  const customerId = parseInt(externalCustomerId.replace(/\D/g, ""), 10);
  const invoiceId = parseInt(externalInvoiceId.replace(/\D/g, ""), 10);

  // find customer
  const customer = await prisma.customer.findFirst({
    where: {
      externalCustomerId: customerId,
    },
  });

  if (!customer) {
    return createError({
      message: messages.CUSTOMER_NOT_FOUND,
    });
  }

  // check if invoice already exists
  const existingInvoice = await prisma.invoice.findFirst({
    where: {
      externalInvoiceId: invoiceId,
      ownerId: customer.id,
    },
  });

  if (existingInvoice) {
    return createError({
      message: messages.INVOICE_ALREADY_EXISTS,
    });
  }

  // Create invoice
  let data: any = {
    data: {
      amount,
      status,
      dueDate,
      invoiceDate,
      description,
      ownerId: customer.id,
      externalInvoiceId: invoiceId,
    },
  };

  const newInvoice = await prisma.invoice.create(data);

  return createResponse({
    message: messages.SUCCESS,
    payload: { invoice: newInvoice },
  });
};
