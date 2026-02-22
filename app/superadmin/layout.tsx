import { SuperadminLayoutClient } from "@/components/shared/SuperadminLayoutClient";

export default function SuperadminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SuperadminLayoutClient>{children}</SuperadminLayoutClient>;
}
