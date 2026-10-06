import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { ProjectForm } from "@/components/admin/project-form";
import { updateProjectAction } from "@/actions/admin-actions";

export const dynamic = "force-dynamic";

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id, 10);
  if (isNaN(id)) {
    notFound();
  }

  const project = await prisma.project.findUnique({
    where: { id },
  });

  if (!project) {
    notFound();
  }

  const boundUpdateAction = updateProjectAction.bind(null, id);

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
            Edit Project: {project.title}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Update project details, screenshot, or links.
          </p>
        </div>
      </div>

      <ProjectForm
        initialData={project}
        onSubmitAction={boundUpdateAction}
        isEditing
      />
    </div>
  );
}
