import { getDashboardStatsAction } from "@/app/actions/stats";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { ShoppingBag, DollarSign, Users, Calendar, UtensilsCrossed } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SuperadminDashboardPage() {
  const stats = await getDashboardStatsAction();

  if (stats.error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
        {stats.error}
      </div>
    );
  }

  const cards = [
    {
      title: "Orders today",
      value: stats.ordersToday,
      icon: ShoppingBag,
    },
    {
      title: "Revenue today",
      value: formatCurrency(stats.revenue),
      icon: DollarSign,
    },
    {
      title: "In queue",
      value: stats.queueWaitingCount,
      icon: Users,
    },
    {
      title: "Reservations today",
      value: stats.reservationsTodayCount,
      icon: Calendar,
    },
    {
      title: "Active orders",
      value: stats.activeOrdersCount,
      icon: UtensilsCrossed,
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <span className="text-sm font-medium text-muted-foreground">
                {card.title}
              </span>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
