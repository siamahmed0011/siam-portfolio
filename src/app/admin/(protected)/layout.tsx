import type { Metadata } from "next";
import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/admin-auth";
import { AdminShell } from "@/components/admin/admin-shell";

export const metadata: Metadata = {
  title: "Admin Dashboard | Portfolio",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = await requireAdmin();

  return <AdminShell user={user}>{children}</AdminShell>;
}