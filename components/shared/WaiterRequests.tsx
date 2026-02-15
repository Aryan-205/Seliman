"use client";

import { useEffect, useState } from "react";
import { getWaiterRequestsAction, acknowledgeWaiterRequestAction } from "@/app/actions/waiter-requests";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Bell, Check } from "lucide-react";

type WaiterRequest = {
  id: string;
  tableNumber: string;
  status: string;
  createdAt: Date;
};

export function WaiterRequests({ initialRequests }: { initialRequests: WaiterRequest[] }) {
  const [requests, setRequests] = useState(initialRequests);

  useEffect(() => {
    const interval = setInterval(async () => {
      const { requests: next } = await getWaiterRequestsAction();
      setRequests(next);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  async function handleAcknowledge(id: string) {
    await acknowledgeWaiterRequestAction(id);
    setRequests((prev) => prev.filter((r) => r.id !== id));
  }

  if (requests.length === 0) {
    return (
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Waiter requests
          </h2>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No pending requests.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Waiter requests
        </h2>
      </CardHeader>
      <CardContent className="space-y-2">
        {requests.map((req) => (
          <div
            key={req.id}
            className="flex items-center justify-between gap-4 rounded-lg border bg-muted/30 px-4 py-3"
          >
            <div>
              <p className="font-medium">Table {req.tableNumber}</p>
              <p className="text-xs text-muted-foreground">
                Requested {new Date(req.createdAt).toLocaleTimeString()}
              </p>
            </div>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleAcknowledge(req.id)}
            >
              <Check className="h-4 w-4 mr-1" />
              Ack
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
