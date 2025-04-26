"use client";
import { redirect } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";

import { LoginForm } from "@/components/auth/login-form";
import PageLoader from "@/components/ui/page-loader";

export default function LoginPage() {
  const { data: session, status } = useSession();
  if (session) {
    redirect("/dashboard");
  }

  if (status === "loading") return <PageLoader />;

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="mx-auto w-full max-w-md space-y-6 p-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Login</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Enter your credentials to access your account
          </p>
        </div>
        <LoginForm />
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
