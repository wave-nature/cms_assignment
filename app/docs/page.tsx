"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ExternalInvoicesDocs() {
  const router = useRouter();

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Back Button */}
      <Button variant="outline" onClick={() => router.back()}>
        ← Back
      </Button>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          External Invoices API
        </h1>
        <p className="text-muted-foreground">
          Manage external invoices using these endpoints.
        </p>
      </div>

      <Tabs defaultValue="get" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="get">GET Invoice</TabsTrigger>
          <TabsTrigger value="post">POST Invoice</TabsTrigger>
        </TabsList>

        {/* GET */}
        <TabsContent value="get">
          <Card>
            <CardHeader>
              <CardTitle>GET /api/external/invoices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Retrieve an invoice by external customer ID and invoice ID.</p>

              <div className="space-y-2">
                <h3 className="font-semibold">Query Parameters:</h3>
                <ul className="list-disc list-inside text-sm">
                  <li>
                    <code>externalCustomerId</code> (string) - Example:{" "}
                    <code>CID_12</code>
                  </li>
                  <li>
                    <code>externalInvoiceId</code> (string) - Example:{" "}
                    <code>INV_05</code>
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Sample Request:</h3>
                <pre className="bg-muted p-4 rounded-md text-sm overflow-auto">
                  {`GET /api/external/invoices?externalCustomerId=CID_12&externalInvoiceId=INV_05`}
                </pre>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Sample Response:</h3>
                <pre className="bg-muted p-4 rounded-md text-sm overflow-auto">
                  {`{
  "type": "response",
  "message": "success",
  "payload": {
    "invoice": {
      "id": "uuid",
      "amount": 12,
      "status": "Pending",
      "dueDate": "2025-04-27T07:35:58.186Z",
      "invoiceDate": "2025-04-27T07:35:58.186Z",
      "externalInvoiceId": 5,
      "description": null,
      "ownerId": "uuid",
      "createdAt": "2025-04-27T07:35:58.186Z",
      "updatedAt": "2025-04-27T07:35:58.186Z"
    }
  }
}`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* POST */}
        <TabsContent value="post">
          <Card>
            <CardHeader>
              <CardTitle>POST /api/external/invoices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Create a new invoice with external identifiers.</p>

              <div className="space-y-2">
                <h3 className="font-semibold">Request Body:</h3>
                <ul className="list-disc list-inside text-sm">
                  <li>
                    <code>externalCustomerId</code> (string) - Example:{" "}
                    <code>CID_12</code>
                  </li>
                  <li>
                    <code>externalInvoiceId</code> (string) - Example:{" "}
                    <code>INV_05</code>
                  </li>
                  <li>
                    <code>amount</code> (number) - Example: <code>12.0</code>
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Sample Request:</h3>
                <pre className="bg-muted p-4 rounded-md text-sm overflow-auto">
                  {`POST /api/external/invoices

{
  "externalCustomerId": "CID_12",
  "externalInvoiceId": "INV_05",
  "amount": 12.0
}`}
                </pre>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Sample Response:</h3>
                <pre className="bg-muted p-4 rounded-md text-sm overflow-auto">
                  {`{
  "type": "response",
  "message": "success",
  "payload": {
    "invoice": {
      "id": "uuid",
      "amount": 12,
      "status": "Pending",
      "dueDate": "2025-04-27T07:35:58.186Z",
      "invoiceDate": "2025-04-27T07:35:58.186Z",
      "externalInvoiceId": 5,
      "description": null,
      "ownerId": "uuid",
      "createdAt": "2025-04-27T07:35:58.186Z",
      "updatedAt": "2025-04-27T07:35:58.186Z"
    }
  }
}`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
