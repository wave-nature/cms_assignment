"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import axois from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

type FormData = {
  email: string;
  password: string;
};

export function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      toast.loading("Creating account...");
      const email = data.email;
      const password = data.password;

      try {
        // signup
        const res = await axois.post("/api/admin/register", {
          email,
          password,
        });

        const response: any = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });
        if (!response?.error) {
          router.push("/");
          router.refresh();
        }

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        // Process response here
        toast.dismiss();
        toast.success("Account created successfully, Logging in...");
      } catch (error: any) {
        toast.dismiss();
        console.log("Signup Failed:", error);
        toast.error(error?.response?.data?.message || "Signup Failed");
      } finally {
        setIsLoading(false);
      }
    } catch (error) {}
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Enter a valid email",
              },
            })}
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
          {errors.password && (
            <p className="text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Create Account"}
        </Button>
      </form>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-700" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white dark:bg-black px-2 text-gray-500">
            Or continue with
          </span>
        </div>
      </div>

      {/* Google Sign-In Button */}
      <button
        onClick={() => signIn("google")}
        className="w-full rounded-md border border-gray-300 p-2 text-sm font-medium hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
      >
        Continue with Google
      </button>
    </>
  );
}
