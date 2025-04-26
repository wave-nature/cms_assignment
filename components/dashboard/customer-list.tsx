"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type SortingState,
  getSortedRowModel,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import toast from "react-hot-toast";

type Customer = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
  invoiceCount: number;
  totalSpent: number;
  externalId: string;
  Invoice: any[];
  externalCustomerId: string;
};

export function CustomerList() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [totalCustomers, setTotalCustomers] = useState<number>(0);
  const [emailSearch, setEmailSearch] = useState<string>("");

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/admin/customers", {
        params: {
          page,
          pageSize,
          email: emailSearch || undefined, // pass only if searched
        },
      });

      const { payload, pagination } = res.data;
      setCustomers(payload.customers || []);
      setTotalCustomers(pagination.Total || 0);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page, pageSize, emailSearch]);

  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: "fullName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <Link
          href={`/dashboard/customer/${row.original.id}`}
          className="font-medium hover:underline"
        >
          {row.getValue("fullName")}
        </Link>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge variant={status ? "default" : "secondary"}>
            {status ? "Active" : "Inactive"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "invoiceCount",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Invoices
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const invoices = row.original.Invoice;

        return <div className="text-center">{invoices?.length || 0}</div>;
      },
    },
    {
      accessorKey: "totalSpent",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total Spent
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const invoices = row.original.Invoice;
        const totalSpent = invoices.reduce((acc, invoice) => {
          return acc + (invoice.total || 0);
        }, 0);
        const amount = totalSpent;
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);
        return <div className="text-center font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "externalCustomerId",
      header: "External ID",
      cell: ({ row }) => (
        <>
          {(row.getValue("externalCustomerId")
            ? "CID_" + row.getValue("externalCustomerId")
            : "") || "N/A"}
        </>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const customer = row.original;
        const [open, setOpen] = useState(false);

        return (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() =>
                    navigator.clipboard.writeText(
                      "CID_" + customer.externalCustomerId
                    )
                  }
                >
                  Copy Customer ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href={`/dashboard/customer/${customer.id}`}>
                    View Customer
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href={`/dashboard/customer/${customer.id}/edit`}>
                    Edit Customer
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href={`/dashboard/customer/${customer.id}/invoice/new`}>
                    Create Invoice
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => {
                    // open delete dialog
                    setOpen(true);
                  }}
                >
                  Delete Customer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DeleteDialog
              open={open}
              setOpen={setOpen}
              text="This action can't be undone. Are you sure you want to delete this customer and his/her invoices too?"
              onConfirm={async () => {
                const toastId = toast.loading("Deleting customer...");
                try {
                  const res = await axios.delete(
                    `/api/admin/customers/${customer.id}`
                  );

                  if (res.status === 200) {
                    toast.dismiss(toastId);
                    toast.success("Customer deleted successfully!");
                    setPage(1);
                  }
                } catch (error) {
                  toast.dismiss(toastId);
                  toast.error(
                    "Error while deleting customer, please try again later."
                  );
                } finally {
                  toast.dismiss(toastId);
                  setOpen(false);
                }
              }}
            />
          </>
        );
      },
    },
  ];

  const table = useReactTable({
    data: customers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center py-4">
          <Input
            placeholder="Search by email..."
            value={emailSearch}
            onChange={(e) => {
              setEmailSearch(e.target.value);
              setPage(1); // Reset to first page on new search
            }}
            className="max-w-sm"
          />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="text-center py-10"
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              ) : customers.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="text-center py-10"
                  >
                    No customers found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between py-4">
          <div className="text-sm text-muted-foreground">
            Showing {(page - 1) * pageSize + 1} to{" "}
            {Math.min(page * pageSize, totalCustomers)} of {totalCustomers}{" "}
            customers
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((prev) => prev + 1)}
              disabled={page * pageSize >= totalCustomers}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
