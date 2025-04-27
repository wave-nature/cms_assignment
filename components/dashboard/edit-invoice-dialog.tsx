"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { CalendarIcon, Edit } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import axios from "axios";
import toast from "react-hot-toast";

interface EditInvoiceDialogProps {
  invoice: {
    id: string;
    amount: number;
    status: string;
    invoiceDate: string;
    dueDate: string;
    description: string;
    externalId: string;
    ownerId: string;
  };
  refresh: boolean;
  setRefresh: (refresh: boolean) => void;
}

interface FormValues {
  amount: string;
  status: string;
  description: string;
  invoiceDate: Date;
  dueDate: Date;
}

export function EditInvoiceDialog({
  invoice,
  refresh,
  setRefresh,
}: EditInvoiceDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      amount: invoice.amount.toString(),
      status: invoice.status,
      description: invoice.description,
      invoiceDate: new Date(invoice.invoiceDate),
      dueDate: new Date(invoice.dueDate),
    },
  });

  const invoiceDate = watch("invoiceDate");
  const dueDate = watch("dueDate");

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    const toastId = toast.loading("Updating invoice...");
    try {
      const { amount, status, description, invoiceDate, dueDate } = data;
      const newValues: any = {
        amount,
        status,
        description,
        invoiceDate: invoiceDate.toISOString(),
        dueDate: dueDate.toISOString(),
      };
      const fieldChanged = Object.keys(newValues).reduce((acc, key) => {
        const newValue = newValues[key];
        // @ts-ignore
        const prevValue = invoice[key];

        if (prevValue != newValue) {
          acc[key] = { prevValue, newValue };
        }

        return acc;
      }, {} as Record<string, { prevValue: any; newValue: any }>);
      const res = await axios.patch(`/api/admin/invoices/${invoice.id}`, {
        amount: parseFloat(amount),
        status,
        description,
        invoiceDate,
        dueDate,
        fieldChanged,
      });

      if (res.status === 200) {
        toast.dismiss(toastId);
        toast.success("Invoice updated successfully");
        setRefresh(!refresh);
      }
    } catch (error) {
      toast.dismiss(toastId);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message || "Something went wrong");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Edit className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Invoice</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
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
                  placeholder="0.00"
                  className="pl-7"
                  {...register("amount", { required: true })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={watch("status")}
                onValueChange={(value) => setValue("status", value)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Overdue">Overdue</SelectItem>
                  <SelectItem value="PastDue">Pastdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Invoice Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !invoiceDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {invoiceDate ? format(invoiceDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={invoiceDate}
                    onSelect={(date) => date && setValue("invoiceDate", date)}
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
                    {dueDate ? format(dueDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={(date) => date && setValue("dueDate", date)}
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
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
