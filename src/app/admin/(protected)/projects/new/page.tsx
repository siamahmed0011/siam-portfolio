import Link from "next/link";
import { ProjectForm } from "@/components/admin/project-form";
import { createProjectAction } from "@/actions/admin-actions";

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/projects"
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-title)]">
            Create New Project
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Add a new portfolio project with description, screenshot, and URLs.
          </p>
        </div>
      </div>

      <ProjectForm onSubmitAction={createProjectAction} />
    </div>
  );
}
