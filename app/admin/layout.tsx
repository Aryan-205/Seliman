import { AdminNav } from "@/components/shared/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AdminNav />
      <main className="flex-1 w-full px-4 py-6">{children}</main>
    </div>
  );
}
