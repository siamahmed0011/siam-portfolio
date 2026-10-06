"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateSettingsAction, saveSingleSettingAction, deleteSettingAction } from "@/actions/admin-actions";

interface SettingsFormProps {
  settings: Record<string, string | null>;
  allSettingsList: Array<{ id: number; key: string; value: string | null }>;
}

const inputCls =
  "w-full h-10 px-4 rounded-xl bg-white/[0.05] border border-white/[0.09] text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all";
const labelCls = "block text-sm font-medium text-slate-300 mb-1.5";
const hintCls = "text-xs text-slate-500 mt-1.5 leading-relaxed";
const textareaCls =
  "w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.09] text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none";

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-5 sm:p-7 rounded-2xl bg-[#111827] border border-white/[0.07] space-y-5">
      <div className="pb-4 border-b border-white/[0.06]">
        <h2 className="text-sm font-bold text-white">{title}</h2>
        {description && (
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

export function SettingsForm({ settings, allSettingsList }: SettingsFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [statusMsg, setStatusMsg] = useState<{ text: string; isError?: boolean } | null>(null);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

  async function handleMainSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatusMsg(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        const result = await updateSettingsAction(formData);
        if (result.success) {
          setStatusMsg({ text: result.message || "Settings updated successfully!" });
          router.refresh();
        } else {
          setStatusMsg({ text: result.message || "Failed to update settings", isError: true });
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "An unexpected error occurred";
        setStatusMsg({ text: msg, isError: true });
      }
    });
  }

  async function handleAddCustomSetting(e: React.FormEvent) {
    e.preventDefault();
    if (!newKey.trim()) return;
    startTransition(async () => {
      try {
        const result = await saveSingleSettingAction(newKey.trim(), newValue.trim());
        if (result.success) {
          setNewKey("");
          setNewValue("");
          setStatusMsg({ text: `Custom setting "${newKey}" created!` });
          router.refresh();
        } else {
          setStatusMsg({ text: result.message || "Failed to add setting", isError: true });
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to add setting";
        setStatusMsg({ text: msg, isError: true });
      }
    });
  }

  async function handleDeleteSetting(id: number, key: string) {
    if (!confirm(`Are you sure you want to delete setting "${key}"?`)) return;
    startTransition(async () => {
      try {
        const result = await deleteSettingAction(id);
        if (result.success) {
          setStatusMsg({ text: `Setting "${key}" deleted` });
          router.refresh();
        } else {
          setStatusMsg({ text: result.message || "Failed to delete setting", isError: true });
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to delete setting";
        setStatusMsg({ text: msg, isError: true });
      }
    });
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Status alert */}
      {statusMsg && (
        <div
          className={`p-4 rounded-xl text-sm flex items-start gap-3 ${
            statusMsg.isError
              ? "bg-red-950/60 border border-red-800 text-red-300"
              : "bg-emerald-950/60 border border-emerald-800 text-emerald-300"
          }`}
        >
          {statusMsg.isError ? (
            <svg className="w-5 h-5 shrink-0 text-red-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
          <div>
            <p className="font-semibold">{statusMsg.isError ? "Error" : "Success"}</p>
            <p className="text-xs mt-0.5 opacity-90">{statusMsg.text}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleMainSubmit} className="space-y-6">
        {/* 1 — Identity & Hero */}
        <SectionCard
          title="Identity & Hero Section"
          description="Display name and hero introduction headlines shown across the portfolio."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="site_name" className={labelCls}>
                Site / Brand Name
              </label>
              <input
                type="text"
                id="site_name"
                name="site_name"
                defaultValue={settings.site_name || ""}
                placeholder="Shiam Ahmed"
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="hero_title" className={labelCls}>
                Hero Title / Main Headline
              </label>
              <input
                type="text"
                id="hero_title"
                name="hero_title"
                defaultValue={settings.hero_title || ""}
                placeholder="Shiam Ahmed"
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <label htmlFor="hero_description" className={labelCls}>
              Hero Subtitle / Description
            </label>
            <textarea
              id="hero_description"
              name="hero_description"
              rows={3}
              defaultValue={settings.hero_description || ""}
              placeholder="Flutter Developer & Digital Marketer..."
              className={textareaCls}
              style={{ minHeight: "90px" }}
            />
          </div>

          <div>
            <label htmlFor="typing_roles" className={labelCls}>
              Typing Roles Animation
            </label>
            <input
              type="text"
              id="typing_roles"
              name="typing_roles"
              defaultValue={settings.typing_roles || ""}
              placeholder="Web Developer, Digital Marketer, Frontend Designer"
              className={inputCls}
            />
            <p className={hintCls}>
              Comma-separated list. These titles rotate with a typewriter animation on the hero section.
            </p>
          </div>
        </SectionCard>

        {/* 2 — About & Profile */}
        <SectionCard
          title="About & Profile Details"
          description="Detailed biography text and core institutional background shown on the About page."
        >
          <div>
            <label htmlFor="about_intro" className={labelCls}>
              About Introduction Text
            </label>
            <textarea
              id="about_intro"
              name="about_intro"
              rows={5}
              defaultValue={settings.about_intro || ""}
              placeholder="Detailed introduction displayed on the About page..."
              className={textareaCls}
              style={{ minHeight: "120px" }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label htmlFor="university" className={labelCls}>
                University
              </label>
              <input
                type="text"
                id="university"
                name="university"
                defaultValue={settings.university || ""}
                placeholder="Daffodil International University"
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="department" className={labelCls}>
                Department
              </label>
              <input
                type="text"
                id="department"
                name="department"
                defaultValue={settings.department || ""}
                placeholder="CSE"
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="interests" className={labelCls}>
                Interests & Focus Areas
              </label>
              <input
                type="text"
                id="interests"
                name="interests"
                defaultValue={settings.interests || ""}
                placeholder="Web development, Machine learning"
                className={inputCls}
              />
            </div>
          </div>
        </SectionCard>

        {/* 3 — Contact Information */}
        <SectionCard
          title="Contact Information"
          description="Public contact email and location displayed on the contact page."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="contact_email" className={labelCls}>
                Contact Email
              </label>
              <input
                type="email"
                id="contact_email"
                name="contact_email"
                defaultValue={settings.contact_email || settings.Contact_email || ""}
                placeholder="your@email.com"
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="location" className={labelCls}>
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                defaultValue={settings.location || settings.Location || ""}
                placeholder="Mirpur 2, Dhaka, Bangladesh"
                className={inputCls}
              />
            </div>
          </div>
        </SectionCard>

        {/* 4 — Social Profiles */}
        <SectionCard
          title="Social Profiles"
          description="Social media profile URLs used in the footer and contact page."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="linkedin_url" className={labelCls}>
                LinkedIn URL
              </label>
              <input
                type="url"
                id="linkedin_url"
                name="linkedin_url"
                defaultValue={settings.linkedin_url || ""}
                placeholder="https://www.linkedin.com/in/..."
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="github_url" className={labelCls}>
                GitHub URL
              </label>
              <input
                type="url"
                id="github_url"
                name="github_url"
                defaultValue={settings.github_url || ""}
                placeholder="https://github.com/..."
                className={inputCls}
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="facebook_link" className={labelCls}>
                Facebook URL
              </label>
              <input
                type="url"
                id="facebook_link"
                name="facebook_link"
                defaultValue={settings.facebook_link || settings.Facebook_link || ""}
                placeholder="https://www.facebook.com/..."
                className={inputCls}
              />
            </div>
          </div>
        </SectionCard>

        {/* 5 — Resume / CV */}
        <SectionCard
          title="Resume / CV Document"
          description="File downloaded when visitors click &quot;Download CV&quot;."
        >
          <div>
            <label className={labelCls}>Current CV File Path</label>
            <input
              type="text"
              name="cv_file"
              defaultValue={settings.cv_file || ""}
              placeholder="settings/placeholder_cv.pdf"
              className={`${inputCls} font-mono`}
            />
          </div>
          <div>
            <label className={labelCls}>Upload New CV (PDF)</label>
            <input
              type="file"
              name="cv_file_upload"
              accept="application/pdf"
              className="block w-full text-sm text-slate-400 file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 file:cursor-pointer cursor-pointer transition-all"
            />
            <p className={hintCls}>
              Max 4.5MB. Allowed format: PDF. Stored securely on Vercel Blob storage.
            </p>
          </div>
        </SectionCard>

        {/* Save button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="h-11 px-8 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/25 disabled:opacity-50 transition-all cursor-pointer inline-flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </>
            ) : (
              "Save All Settings"
            )}
          </button>
        </div>
      </form>

      {/* 6 — Raw Key-Value Store */}
      <SectionCard
        title="Advanced: Raw Settings Keys"
        description="All configuration key-value pairs stored in the database. Add custom keys or remove unused ones."
      >
        {/* Add custom setting */}
        <form onSubmit={handleAddCustomSetting} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Key (e.g. twitter_handle)"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            className="flex-1 h-10 px-4 rounded-xl bg-slate-800/90 border border-slate-700/80 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />
          <input
            type="text"
            placeholder="Value"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            className="flex-1 h-10 px-4 rounded-xl bg-slate-800/90 border border-slate-700/80 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />
          <button
            type="submit"
            disabled={isPending || !newKey.trim()}
            className="h-10 px-5 bg-slate-800 hover:bg-slate-700 text-indigo-400 font-semibold text-xs rounded-xl border border-slate-700/80 disabled:opacity-50 transition-colors inline-flex items-center justify-center shrink-0"
          >
            Add Key
          </button>
        </form>

        {/* Key-value table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800/80 mt-2">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-800">
              <tr>
                <th className="px-5 py-3">Key</th>
                <th className="px-5 py-3">Value</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {allSettingsList.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-3 text-indigo-300 font-medium">{item.key}</td>
                  <td className="px-5 py-3 text-slate-400 max-w-xs truncate font-sans text-xs">
                    {item.value || "—"}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleDeleteSetting(item.id, item.key)}
                      className="text-rose-400 hover:text-rose-300 hover:underline text-xs font-sans font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
