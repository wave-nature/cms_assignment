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
  });

  // Get pagination data
  const totalCoupons = await prisma.customer.count({
    where: {
      email: {
        contains: search,
        mode: "insensitive",
      },
    },
  });
  const Pages = Math.ceil(totalCoupons / pageSize);

  return createResponse({
    message: messages.SUCCESS,
    payload: { customers },
    pagination: {
      page,
      pageSize,
      Total: totalCoupons,
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
  const { email } = value;

  // Check if the coupon already exists
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

  // Create the coupon
  let data: any = {
    data: {},
  };

  const newCoupon = await prisma.customer.create(data);

  return createResponse({
    message: messages.SUCCESS,
    payload: { coupon: newCoupon },
  });
};
