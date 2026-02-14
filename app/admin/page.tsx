import { getOrdersAction } from "@/app/actions/orders";
import { OrderFeed } from "@/components/shared/OrderFeed";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const { orders } = await getOrdersAction();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Live Order Feed</h1>
      <OrderFeed initialOrders={orders} />
    </div>
  );
}
