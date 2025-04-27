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
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const admin = await isAdmin(request);
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
  const { fullName, email, phone, status, address } = value;

  // Check if the customer already exists
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

  // Update the customer
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
  const admin = await isAdmin(request);
  if (!admin) {
    createError({
      message: messages.UNAUTHORIZED,
    });
  }

  const id = (await params).id;

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
