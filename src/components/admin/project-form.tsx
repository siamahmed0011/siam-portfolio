"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getAssetUrl } from "@/lib/utils";
import type { ActionResult } from "@/actions/admin-actions";

interface ProjectFormData {
  id?: number;
  title?: string;
  description?: string | null;
  techStack?: string | null;
  githubUrl?: string | null;
  demoUrl?: string | null;
  image?: string | null;
}

interface ProjectFormProps {
  initialData?: ProjectFormData;
  onSubmitAction: (formData: FormData) => Promise<ActionResult>;
  isEditing?: boolean;
}

export function ProjectForm({
  initialData,
  onSubmitAction,
  isEditing = false,
}: ProjectFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialData?.image ? getAssetUrl(initialData.image) : null
  );
  const [removeImage, setRemoveImage] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setRemoveImage(false);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  }

  function handleRemoveImage() {
    setRemoveImage(true);
    setPreviewUrl(null);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    if (removeImage) {
      formData.set("remove_image", "true");
    }

    startTransition(async () => {
      try {
        const result = await onSubmitAction(formData);
        if (result.success) {
          setSuccessMsg(result.message || "Project saved successfully!");
          router.push("/admin/projects");
          router.refresh();
        } else {
          setErrorMsg(result.message || "Failed to save project");
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "An unexpected error occurred";
        setErrorMsg(msg);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-sm flex items-start gap-3">
          <svg className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p className="font-semibold">Unable to save project</p>
            <p className="text-xs text-rose-400 mt-0.5">{errorMsg}</p>
          </div>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-sm flex items-start gap-3">
          <svg className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <div>
            <p className="font-semibold">Success</p>
            <p className="text-xs text-emerald-400 mt-0.5">{successMsg}</p>
          </div>
        </div>
      )}

      <div className="p-6 sm:p-8 rounded-2xl bg-[#0c111e]/90 border border-slate-800/80 space-y-6 shadow-sm">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
            Project Title <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            defaultValue={initialData?.title || ""}
            required
            placeholder="e.g. Food Waste Reduce or Link Shortener"
            className="w-full h-11 px-4 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={initialData?.description || ""}
            placeholder="Detailed description of features, problem solved, and architecture..."
            className="w-full p-4 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all min-h-[110px]"
          />
        </div>

        {/* Tech Stack */}
        <div>
          <label htmlFor="tech_stack" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
            Tech Stack <span className="text-slate-500 text-[11px] font-normal lowercase">(comma-separated)</span>
          </label>
          <input
            type="text"
            id="tech_stack"
            name="tech_stack"
            defaultValue={initialData?.techStack || ""}
            placeholder="e.g. Next.js, TypeScript, PostgreSQL, Tailwind CSS, Prisma"
            className="w-full h-11 px-4 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
        </div>

        {/* URLs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="github_url" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              GitHub Repository URL
            </label>
            <input
              type="url"
              id="github_url"
              name="github_url"
              defaultValue={initialData?.githubUrl || ""}
              placeholder="https://github.com/username/repository"
              className="w-full h-11 px-4 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          <div>
            <label htmlFor="demo_url" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Live Demo / Website URL
            </label>
            <input
              type="url"
              id="demo_url"
              name="demo_url"
              defaultValue={initialData?.demoUrl || ""}
              placeholder="https://my-app.vercel.app"
              className="w-full h-11 px-4 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>
        </div>

        {/* Image Upload */}
        <div className="pt-4 border-t border-slate-800/80">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
            Project Screenshot / Cover Image
          </label>
          
          {previewUrl && !removeImage && (
            <div className="mb-4 relative inline-block rounded-xl overflow-hidden border border-slate-700 bg-slate-950 shadow-md">
              <div className="w-72 h-40 relative">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-rose-600/90 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg transition-colors flex items-center gap-1"
                title="Remove image"
              >
                <span>Remove</span>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          <input
            type="file"
            id="image"
            name="image"
            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
            onChange={handleFileChange}
            className="block w-full text-xs text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 file:cursor-pointer cursor-pointer transition-all"
          />
          <p className="text-[11px] text-slate-500 mt-2">
            Recommended aspect ratio 16:9. Max 10MB. Allowed formats: JPG, PNG, WEBP, GIF, SVG.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="h-10 px-6 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-600/25 disabled:opacity-50 transition-all cursor-pointer inline-flex items-center justify-center"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
          ) : isEditing ? "Update Project" : "Create Project"}
        </button>
        <Link
          href="/admin/projects"
          className="h-10 px-5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition-colors inline-flex items-center justify-center"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
