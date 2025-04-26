"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import axios from "axios";

type FormData = {
  fullName?: string;
  email: string;
  phone?: string;
  address?: string;
  status?: boolean;
};

export function CustomerForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      status: true,
    },
  });

  const formData = watch();

  const onSubmit = async (data: FormData) => {
    const toastId = toast.loading("Saving customer...");

    try {
      await axios.post("/api/admin/customers", data);

      toast.success("Customer saved successfully");
      router.push("/dashboard/customers");
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to save customer";
      toast.error(message);
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Acme Inc."
                {...register("fullName")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email*</Label>
              <Input
                id="email"
                type="email"
                placeholder="info@acme.com"
                {...register("email", { required: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                placeholder="(555) 123-4567"
                {...register("phone")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status ? "active" : "inactive"}
                onValueChange={(value) =>
                  setValue("status", value === "active")
                }
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              placeholder="123 Main St, Anytown, USA"
              {...register("address")}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/customers")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Customer"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
