import type { ReactNode } from "react";
import { PublicHeader } from "@/components/public/public-header";
import { PublicFooter } from "@/components/public/public-footer";
import { getPortfolioSettings } from "@/lib/settings";

export default async function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  const settings = await getPortfolioSettings();

  return (
    <div className="page-wrapper">
      <PublicHeader siteName={settings.site_name} />
      <main className="content container">{children}</main>
      <PublicFooter siteName={settings.site_name} />
    </div>
  );
}
