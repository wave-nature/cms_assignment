import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/admin/customers/:path*",
    "/api/admin/invoices/:path*",
    "/api/admin/dashboard",
  ], // protect dashboard and api routes
};
