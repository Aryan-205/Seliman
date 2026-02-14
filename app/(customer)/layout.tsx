import { CustomerHeader } from "@/components/shared/CustomerHeader";
import { CartSheet } from "@/components/shared/CartSheet";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <CustomerHeader />
      <main className="flex-1">{children}</main>
      <CartSheet />
    </div>
  );
}
