"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminQRPage() {
  const [tableId, setTableId] = useState("5");
  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const tableUrl = `${baseUrl}/table/${tableId}`;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">QR Code Generation</h1>
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Table link</CardTitle>
          <CardDescription>
            Generate a link for each table. Customers scan the QR code to set their table and open the menu.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Table number</label>
            <Input
              value={tableId}
              onChange={(e) => setTableId(e.target.value)}
              placeholder="e.g. 5"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">URL</label>
            <p className="text-sm text-muted-foreground break-all bg-muted p-3 rounded-md">
              {tableUrl}
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            Use any QR generator (e.g. goqr.me) and paste the URL above to create a printable QR code for this table.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
