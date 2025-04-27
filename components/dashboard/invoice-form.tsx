"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";
import axios from "axios";

const formSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  status: z.enum(["Paid", "Pending", "Overdue","PastDue"]),
  description: z.string().optional(),
  date: z.date(),
  dueDate: z.date(),
});

type FormValues = z.infer<typeof formSchema>;

interface InvoiceFormProps {
  customerId: string;
}

export function InvoiceForm({ customerId }: InvoiceFormProps) {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      status: "Pending",
      description: "",
      date: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = form;

  const date = watch("date");
  const dueDate = watch("dueDate");

  const onSubmit = async (data: FormValues) => {
    const toastId = toast.loading("Creating invoice...");
    try {
      const { amount, status, description, date: invoiceDate, dueDate } = data;

      const res = await axios.post("/api/admin/invoices", {
        amount: parseFloat(amount),
        status,
        description,
        invoiceDate,
        dueDate,
        ownerId: customerId,
      });

      if (res.status === 200) {
        toast.dismiss(toastId);
        toast.success("Invoice created successfully");
        router.push(`/dashboard/customer/${customerId}`);
      }
    } catch (error) {
      toast.dismiss(toastId);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message || "Something went wrong");
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2">
                  $
                </span>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  className="pl-7"
                  placeholder="0.00"
                  {...register("amount")}
                />
                {errors.amount && (
                  <p className="text-sm text-red-600">
                    {errors.amount.message}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={watch("status")}
                onValueChange={(value) =>
                  setValue("status", value as FormValues["status"])
                }
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Overdue">Overdue</SelectItem>
                  <SelectItem value="PastDue">PastDue</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-red-600">{errors.status.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Invoice Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => d && setValue("date", d)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? (
                      format(dueDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={(d) => d && setValue("dueDate", d)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Invoice description or notes"
              {...register("description")}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/dashboard/customer/${customerId}`)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Invoice"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
