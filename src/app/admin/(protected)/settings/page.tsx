import prisma from "@/lib/prisma";
import { SettingsForm } from "@/components/admin/settings-form";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const allSettings = await prisma.setting.findMany({ orderBy: { key: "asc" } });

  const settingsMap: Record<string, string | null> = {};
  for (const s of allSettings) {
    settingsMap[s.key] = s.value;
  }

  return (
    <div className="space-y-7">
      <div className="pb-6 border-b border-white/[0.06]">
        <h1 className="text-2xl font-bold text-white tracking-tight font-[family-name:var(--font-title)]">
          Site Settings & Profile
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-xl">
          Configure identity, hero text, biography, contact info, social links, and resume.
        </p>
      </div>

      <SettingsForm settings={settingsMap} allSettingsList={allSettings} />
    </div>
  );
}
