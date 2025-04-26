import prisma from "@prisma/index";
import { NextRequest } from "next/server";

import { convertURLSearchParamsToObject } from "@/utils/helpers";
import { createError, createResponse } from "@/utils/responseutils";
import messages from "@/utils/messages";
import validation from "./validation";

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const invoiceId = (await params).id;
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
  const { page, pageSize } = value;

  // Get all logs
  const logs = await prisma.invoiceLogs.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    where: {
      invoiceId,
    },
    orderBy: {
      changedAt: "desc",
    },
    include: {
      admin: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });

  // Get pagination data
  const totalLogs = await prisma.invoiceLogs.count({
    where: {
      invoiceId,
    },
  });
  const Pages = Math.ceil(totalLogs / pageSize);

  return createResponse({
    message: messages.SUCCESS,
    payload: { logs },
    pagination: {
      page,
      pageSize,
      Total: totalLogs,
      Pages,
    },
  });
};
