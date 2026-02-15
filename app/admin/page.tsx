import { getOrdersAction } from "@/app/actions/orders";
import { getWaiterRequestsAction } from "@/app/actions/waiter-requests";
import { OrderFeed } from "@/components/shared/OrderFeed";
import { WaiterRequests } from "@/components/shared/WaiterRequests";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [{ orders }, { requests: waiterRequests }] = await Promise.all([
    getOrdersAction(),
    getWaiterRequestsAction(),
  ]);
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-6">Live Order Feed</h1>
        <OrderFeed initialOrders={orders} />
      </div>
      <div>
        <WaiterRequests initialRequests={waiterRequests} />
      </div>
    </div>
  );
}
