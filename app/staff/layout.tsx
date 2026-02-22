import { StaffLayoutClient } from "@/components/shared/StaffLayoutClient";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StaffLayoutClient>{children}</StaffLayoutClient>;
}
