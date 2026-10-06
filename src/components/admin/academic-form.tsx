"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { ActionResult } from "@/actions/admin-actions";

interface AcademicFormData {
  id?: number;
  degree?: string;
  institution?: string;
  year?: string;
  result?: string | null;
  description?: string | null;
}

interface AcademicFormProps {
  initialData?: AcademicFormData;
  onSubmitAction: (formData: FormData) => Promise<ActionResult>;
  isEditing?: boolean;
}

export function AcademicForm({
  initialData,
  onSubmitAction,
  isEditing = false,
}: AcademicFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg(null);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        const result = await onSubmitAction(formData);
        if (result.success) {
          router.push("/admin/academics");
          router.refresh();
        } else {
          setErrorMsg(result.message || "Failed to save academic record");
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
            <p className="font-semibold">Unable to save academic record</p>
            <p className="text-xs text-red-400 mt-0.5">{errorMsg}</p>
          </div>
        </div>
      )}

      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-slate-800/90 space-y-6 shadow-sm">
        {/* Degree */}
        <div>
          <label htmlFor="degree" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
            Degree / Qualification <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            id="degree"
            name="degree"
            defaultValue={initialData?.degree || ""}
            required
            placeholder="e.g. B.Sc. in Computer Science & Engineering"
            className="w-full h-11 sm:h-12 px-4 rounded-xl bg-slate-800/90 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
        </div>

        {/* Institution */}
        <div>
          <label htmlFor="institution" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
            Institution / University <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            id="institution"
            name="institution"
            defaultValue={initialData?.institution || ""}
            required
            placeholder="e.g. Daffodil International University"
            className="w-full h-11 sm:h-12 px-4 rounded-xl bg-slate-800/90 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
        </div>

        {/* Year and Result Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="year" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Passing Year / Period <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              id="year"
              name="year"
              defaultValue={initialData?.year || ""}
              required
              placeholder="e.g. 2026 or 2022 - 2026"
              className="w-full h-11 sm:h-12 px-4 rounded-xl bg-slate-800/90 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          <div>
            <label htmlFor="result" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Result / GPA
            </label>
            <input
              type="text"
              id="result"
              name="result"
              defaultValue={initialData?.result || ""}
              placeholder="e.g. CGPA 3.44 / 4.0 or GPA 5.00"
              className="w-full h-11 sm:h-12 px-4 rounded-xl bg-slate-800/90 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
            Additional Details (Optional)
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={initialData?.description || ""}
            placeholder="Major concentrations, honors, or thesis details..."
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
          ) : isEditing ? "Update Record" : "Create Record"}
        </button>
        <Link
          href="/admin/academics"
          className="h-11 px-5 bg-slate-800/90 hover:bg-slate-700 text-slate-300 text-sm font-semibold rounded-xl border border-slate-700/80 transition-colors inline-flex items-center justify-center"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
