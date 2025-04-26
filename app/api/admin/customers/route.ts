import prisma from "@prisma/index";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

import { convertURLSearchParamsToObject } from "@/utils/helpers";
import { createError, createResponse } from "@/utils/responseutils";
import messages from "@/utils/messages";
import validation from "./validation";

export const GET = async (request: NextRequest) => {
  const token = await getToken({ req: request });

  if (!token) {
    return createError({
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
  const { page, pageSize, search } = value;

  // Get all customers
  const customers = await prisma.customer.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    where: {
      email: {
        contains: search,
        mode: "insensitive",
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      Invoice: true,
    },
  });

  // Get pagination data
  const totalCustomers = await prisma.customer.count({
    where: {
      email: {
        contains: search,
        mode: "insensitive",
      },
    },
  });
  const Pages = Math.ceil(totalCustomers / pageSize);

  return createResponse({
    message: messages.SUCCESS,
    payload: { customers },
    pagination: {
      page,
      pageSize,
      Total: totalCustomers,
      Pages,
    },
  });
};

export const POST = async (request: NextRequest) => {
  const token = await getToken({ req: request });
  // Validate the request body against the schema
  const { error, value } = validation.post.validate(await request.json());
  if (error) {
    return createError({
      message: error?.details?.[0]?.message || messages.VALIDATION_ERROR,
      payload: error.details,
    });
  }
  const { fullName, email, phone, status, address } = value;

  // Check if the customer already exists
  const customer = await prisma.customer.findFirst({
    where: {
      email,
    },
  });
  if (customer) {
    return createError({
      message: messages.CUSTOMER_ALREADY_EXISTS,
    });
  }

  // Create the customer
  let data: any = {
    data: {
      fullName,
      email,
      phone,
      status,
      address,
      adminId: token?.sub,
    },
  };

  const newCustomer = await prisma.customer.create(data);

  return createResponse({
    message: messages.SUCCESS,
    payload: { customer: newCustomer },
  });
};
