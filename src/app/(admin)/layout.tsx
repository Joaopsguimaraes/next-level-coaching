import { AppLayoutProvider } from "@/layout/AppLayout";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AppLayoutProvider>{children}</AppLayoutProvider>;
}
