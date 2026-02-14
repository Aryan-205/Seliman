import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/shared/Providers";


export const metadata: Metadata = {
  title: "Restaurant SaaS | Digital Menu & Orders",
  description: "High-performance restaurant ordering and management platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={` font-sans antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
