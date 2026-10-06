import Link from "next/link";
import prisma from "@/lib/prisma";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteAcademicAction } from "@/actions/admin-actions";

export const dynamic = "force-dynamic";

export default async function AdminAcademicsPage() {
  const academics = await prisma.academic.findMany({ orderBy: { year: "desc" } });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/70">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight font-[family-name:var(--font-title)]">
            Academic Journey
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Degrees, diplomas, colleges, certifications, and educational milestones.
          </p>
        </div>
        <Link
          href="/admin/academics/new"
          className="inline-flex items-center gap-2 h-9 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-600/25 transition-all whitespace-nowrap shrink-0 self-start sm:self-auto"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          New Record
        </Link>
      </div>

      {academics.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-[#0c111e]/90 border border-slate-800/80">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mb-4">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
            </svg>
          </div>
          <p className="text-base font-semibold text-slate-200">No academic records yet</p>
          <p className="text-sm text-slate-500 mt-1">Add your degrees and qualifications</p>
          <Link
            href="/admin/academics/new"
            className="inline-flex items-center gap-2 h-9 px-5 mt-5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all"
          >
            Add First Record
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {academics.map((a) => (
            <div
              key={a.id}
              className="rounded-2xl bg-[#0c111e]/90 border border-slate-800/80 p-6 hover:border-slate-700/80 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h2 className="text-base font-bold text-white leading-snug">{a.degree}</h2>
                    <p className="text-xs font-semibold text-sky-400 mt-1">{a.institution}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/admin/academics/${a.id}/edit`}
                      className="h-8 px-3 inline-flex items-center text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-lg transition-all"
                    >
                      Edit
                    </Link>
                    <DeleteButton id={a.id} itemName={a.degree} onDelete={deleteAcademicAction} />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 my-3">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800/80 text-slate-300 border border-slate-700">
                    📅 Year: {a.year}
                  </span>
                  {a.result && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      🎓 {a.result}
                    </span>
                  )}
                </div>

                {a.description && (
                  <p className="text-xs text-slate-400 leading-relaxed mt-2">{a.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
