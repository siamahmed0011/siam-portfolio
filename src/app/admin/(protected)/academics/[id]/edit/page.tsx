import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { AcademicForm } from "@/components/admin/academic-form";
import { updateAcademicAction } from "@/actions/admin-actions";

export const dynamic = "force-dynamic";

interface EditAcademicPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditAcademicPage({ params }: EditAcademicPageProps) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id, 10);
  if (isNaN(id)) {
    notFound();
  }

  const academic = await prisma.academic.findUnique({
    where: { id },
  });

  if (!academic) {
    notFound();
  }

  const boundUpdateAction = updateAcademicAction.bind(null, id);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/academics"
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-title)]">
            Edit Academic: {academic.degree}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Modify degree title, institution, year, or result.
          </p>
        </div>
      </div>

      <AcademicForm
        initialData={academic}
        onSubmitAction={boundUpdateAction}
        isEditing
      />
    </div>
  );
}
