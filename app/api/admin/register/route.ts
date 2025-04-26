import prisma from "@prisma/index";

import messages from "@utils/messages";
import { createError, createResponse } from "@utils/responseutils";
import { NextRequest, NextResponse } from "next/server";
import validation from "./validation";
const bcrypt = require("bcryptjs");

export const POST = async (request: NextRequest, response: NextResponse) => {
  // Validate
  const { error, value } = validation.post.validate(await request.json());
  if (error) {
    return createError({
      message: error?.details?.[0]?.message || messages.VALIDATION_ERROR,
      payload: error.details,
    });
  }

  const { email, password } = value;

  // Check if admin already exists
  const targetUser = await prisma.admin.findUnique({
    where: {
      email,
    },
  });

  if (targetUser) {
    return createError({
      message: messages.ALREADY_EXISTS,
      payload: {},
    });
  }

  // Create admin
  const user = await prisma.admin.create({
    data: {
      email,
      password: await bcrypt.hash(password, 10),
      provider: "Email",
    },
  });

  // Return
  return createResponse({
    message: messages.SUCCESS,
    payload: {
      user,
    },
  });
};
