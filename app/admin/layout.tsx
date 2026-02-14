import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/shared/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login?callbackUrl=/admin");
  }
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AdminNav />
      <main className="flex-1 container py-6">{children}</main>
    </div>
  );
}
