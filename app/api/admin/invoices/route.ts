import prisma from "@prisma/index";
import { NextRequest } from "next/server";

import { convertURLSearchParamsToObject, isAdmin } from "@/utils/helpers";
import { createError, createResponse } from "@/utils/responseutils";
import messages from "@/utils/messages";
import validation from "./validation";

export const GET = async (request: NextRequest) => {
  const admin = await isAdmin(request);
  if (!admin) {
    createError({
      message: messages.UNAUTHORIZED,
    });
  }
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
  const { page, pageSize, customerId } = value;
  let query: any = {
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      owner: true,
    },
  };
  let countQuery = {};
  if (customerId) {
    query = {
      ...query,
      where: {
        ownerId: customerId,
      },
    };

    countQuery = {
      where: {
        ownerId: customerId,
      },
    };
  }

  // Get all invoices
  const invoices = await prisma.invoice.findMany(query);

  // Get pagination data
  const totalInvoices = await prisma.invoice.count(countQuery);
  const Pages = Math.ceil(totalInvoices / pageSize);

  return createResponse({
    message: messages.SUCCESS,
    payload: { invoices },
    pagination: {
      page,
      pageSize,
      Total: totalInvoices,
      Pages,
    },
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
  const { amount, status, dueDate, invoiceDate, description, ownerId } = value;

  // Create invoice
  let data: any = {
    data: {
      amount,
      status,
      dueDate,
      invoiceDate,
      description,
      ownerId,
    },
  };

  const newInvoice = await prisma.invoice.create(data);

  return createResponse({
    message: messages.SUCCESS,
    payload: { invoice: newInvoice },
  });
};
