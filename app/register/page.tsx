"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { RegisterForm } from "@/components/auth/register-form";
import PageLoader from "@/components/ui/page-loader";

export default function RegisterPage() {
  const { data: session, status } = useSession();
  if (session) {
    redirect("/dashboard");
  }

  if (status === "loading") return <PageLoader />;

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="mx-auto w-full max-w-md space-y-6 p-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Register</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Create an account to get started
          </p>
        </div>

        {/* Email/Password Form */}
        <RegisterForm />

        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
