// "use client";

// import { useEffect, useState } from "react";
// import { getWaiterRequestsAction, acknowledgeWaiterRequestAction } from "@/app/actions/waiter-requests";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Bell, Check } from "lucide-react";

// type WaiterRequest = {
//   id: string;
//   tableNumber: string;
//   status: string;
//   createdAt: Date;
// };

// export function WaiterRequests({ initialRequests }: { initialRequests: WaiterRequest[] }) {
//   const [requests, setRequests] = useState(initialRequests);

//   useEffect(() => {
//     const interval = setInterval(async () => {
//       const { requests: next } = await getWaiterRequestsAction();
//       setRequests(next);
//     }, 4000);
//     return () => clearInterval(interval);
//   }, []);

//   async function handleAcknowledge(id: string) {
//     await acknowledgeWaiterRequestAction(id);
//     setRequests((prev) => prev.filter((r) => r.id !== id));
//   }

//   if (requests.length === 0) {
//     return (
//       <Card>
//         <CardHeader>
//           <h2 className="text-lg font-semibold flex items-center gap-2">
//             <Bell className="h-5 w-5" />
//             Waiter requests
//           </h2>
//         </CardHeader>
//         <CardContent>
//           <p className="text-sm text-muted-foreground">No pending requests.</p>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <h2 className="text-lg font-semibold flex items-center gap-2">
//           <Bell className="h-5 w-5" />
//           Waiter requests
//         </h2>
//       </CardHeader>
//       <CardContent className="space-y-2">
//         {requests.map((req) => (
//           <div
//             key={req.id}
//             className="flex items-center justify-between gap-4 rounded-lg border bg-muted/30 px-4 py-3"
//           >
//             <div>
//               <p className="font-medium">Table {req.tableNumber}</p>
//               <p className="text-xs text-muted-foreground">
//                 Requested {new Date(req.createdAt).toLocaleTimeString()}
//               </p>
//             </div>
//             <Button
//               size="sm"
//               variant="secondary"
//               onClick={() => handleAcknowledge(req.id)}
//             >
//               <Check className="h-4 w-4 mr-1" />
//               Ack
//             </Button>
//           </div>
//         ))}
//       </CardContent>
//     </Card>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getWaiterRequestsAction, acknowledgeWaiterRequestAction } from "@/app/actions/waiter-requests";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Bell, Check, Zap } from "lucide-react";

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
    // Optimistic UI update for immediate feedback
    setRequests((prev) => prev.filter((r) => r.id !== id));
    await acknowledgeWaiterRequestAction(id);
  }

  return (
    <Card className="border-2 border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
      <CardHeader className="bg-black text-white py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
            </span>
            Live Service Alerts
          </h2>
          <span className="bg-red-600 text-[10px] px-2 py-0.5 rounded-full font-bold">
            {requests.length} ACTIVE
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="flex flex-col gap-4 p-4">
          <AnimatePresence initial={false}>
            {requests.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-12 text-center"
              >
                <Zap className="h-8 w-8 text-zinc-200 mx-auto mb-2" />
                <p className="text-sm text-zinc-400 font-medium">All tables are satisfied.</p>
              </motion.div>
            ) : (
              requests.map((req) => (
                <motion.div
                  key={req.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 50, opacity: 0 }}
                  className="group flex items-center justify-between gap-4 bg-white px-6 py-4 hover:bg-zinc-50 transition-colors border-b border-zinc-100 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-red-600 uppercase tracking-tighter">Needs Assistance</span>
                      <p className="text-2xl font-black text-black leading-none">Table {req.tableNumber}</p>
                      <p className="text-[10px] font-mono text-zinc-400 mt-1 uppercase">
                        Since {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => handleAcknowledge(req.id)}
                    className="bg-black hover:bg-red-600 text-white border-none shadow-md transition-all active:scale-95"
                  >
                    <Check className="h-4 w-4 mr-1.5 stroke-[3px]" />
                    <span className="font-bold uppercase text-[10px] tracking-wider">Acknowledge</span>
                  </Button>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}