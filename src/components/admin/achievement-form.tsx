"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { ActionResult } from "@/actions/admin-actions";

interface AchievementFormData {
  id?: number;
  title?: string;
  issuer?: string | null;
  date?: Date | string | null;
  description?: string | null;
  certificateUrl?: string | null;
}

interface AchievementFormProps {
  initialData?: AchievementFormData;
  onSubmitAction: (formData: FormData) => Promise<ActionResult>;
  isEditing?: boolean;
}

export function AchievementForm({
  initialData,
  onSubmitAction,
  isEditing = false,
}: AchievementFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const formattedDate = initialData?.date
    ? new Date(initialData.date).toISOString().split("T")[0]
    : "";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg(null);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        const result = await onSubmitAction(formData);
        if (result.success) {
          router.push("/admin/achievements");
          router.refresh();
        } else {
          setErrorMsg(result.message || "Failed to save achievement");
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "An unexpected error occurred";
        setErrorMsg(msg);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-800/80 text-red-300 text-sm flex items-start gap-3">
          <svg className="w-5 h-5 shrink-0 text-red-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p className="font-semibold">Unable to save achievement</p>
            <p className="text-xs text-red-400 mt-0.5">{errorMsg}</p>
          </div>
        </div>
      )}

      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-slate-800/90 space-y-6 shadow-sm">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
            Title / Award Name <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            defaultValue={initialData?.title || ""}
            required
            placeholder="e.g. National Hackathon Finalist, Dean's Honor Award"
            className="w-full h-11 sm:h-12 px-4 rounded-xl bg-slate-800/90 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
        </div>

        {/* Issuer and Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="issuer" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Issuer / Organization
            </label>
            <input
              type="text"
              id="issuer"
              name="issuer"
              defaultValue={initialData?.issuer || ""}
              placeholder="e.g. Google, IEEE, University"
              className="w-full h-11 sm:h-12 px-4 rounded-xl bg-slate-800/90 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          <div>
            <label htmlFor="date" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Date Received
            </label>
            <input
              type="date"
              id="date"
              name="date"
              defaultValue={formattedDate}
              className="w-full h-11 sm:h-12 px-4 rounded-xl bg-slate-800/90 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>
        </div>

        {/* Certificate URL */}
        <div>
          <label htmlFor="certificate_url" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
            Certificate / Verification URL
          </label>
          <input
            type="url"
            id="certificate_url"
            name="certificate_url"
            defaultValue={initialData?.certificateUrl || ""}
            placeholder="https://..."
            className="w-full h-11 sm:h-12 px-4 rounded-xl bg-slate-800/90 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={initialData?.description || ""}
            placeholder="Details about the award, competition ranking, or certificate..."
            className="w-full p-4 rounded-xl bg-slate-800/90 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all min-h-[100px]"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="h-11 px-7 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/20 disabled:opacity-50 transition-all cursor-pointer inline-flex items-center justify-center"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
          ) : isEditing ? "Update Achievement" : "Create Achievement"}
        </button>
        <Link
          href="/admin/achievements"
          className="h-11 px-5 bg-slate-800/90 hover:bg-slate-700 text-slate-300 text-sm font-semibold rounded-xl border border-slate-700/80 transition-colors inline-flex items-center justify-center"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
