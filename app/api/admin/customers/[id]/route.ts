import prisma from "@prisma/index";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

import { convertURLSearchParamsToObject } from "@/utils/helpers";
import { createError, createResponse } from "@/utils/responseutils";
import messages from "@/utils/messages";
import validation from "./validation";

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const token = await getToken({ req: request });

  if (!token) {
    return createError({
      message: messages.UNAUTHORIZED,
    });
  }

  // Validate
  const id = (await params).id;
  // Get customer
  const customer = await prisma.customer.findFirst({
    where: {
      id,
    },
  });

  if (!customer) {
    return createError({
      message: messages.NOT_FOUND,
    });
  }

  return createResponse({
    message: messages.SUCCESS,
    payload: { customer },
  });
};

export const PATCH = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  // Validate the request body against the schema
  const { error, value } = validation.patch.validate(await request.json());
  if (error) {
    return createError({
      message: messages.VALIDATION_ERROR,
      payload: error.details,
    });
  }
  const id = (await params).id;
  const { fullName, email, phone, status, address } = value;

  // Check if the coupon already exists
  const customer = await prisma.customer.findFirst({
    where: {
      id,
    },
  });
  if (!customer) {
    return createError({
      message: messages.NOT_FOUND,
    });
  }

  // Create the coupon
  let data: any = {
    fullName,
    email,
    phone,
    status,
    address,
  };

  const updatedCustomer = await prisma.customer.update({
    where: {
      id,
    },
    data,
  });

  return createResponse({
    message: messages.SUCCESS,
    payload: { customer: updatedCustomer },
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

  // Get all customer
  const customer = await prisma.customer.findFirst({
    where: { id },
  });

  if (!customer) {
    return createError({
      message: messages.NOT_FOUND,
    });
  }

  await prisma.customer.delete({ where: { id } });

  return createResponse({
    message: messages.SUCCESS,
    payload: {},
  });
};
