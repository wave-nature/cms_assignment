import prisma from "@prisma/index";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export const convertURLSearchParamsToObject = (
  searchParams: URLSearchParams
) => {
  let obj: any = {};
  searchParams.forEach((value: any, key: any) => {
    obj[key] = value;
  });
  return obj;
};

export const isAdmin = async (request: NextRequest) => {
  const token = await getToken({ req: request });

  if (!token) {
    return null;
  }
  // is admin
  const admin = await prisma.admin.findFirst({
    where: {
      id: token?.sub,
    },
  });
  if (!admin) {
    return null;
  }


  return admin;
};
