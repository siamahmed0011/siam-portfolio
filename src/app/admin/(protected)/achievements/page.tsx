import Link from "next/link";
import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteAchievementAction } from "@/actions/admin-actions";

export const dynamic = "force-dynamic";

export default async function AdminAchievementsPage() {
  const achievements = await prisma.achievement.findMany({ orderBy: { date: "desc" } });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/70">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight font-[family-name:var(--font-title)]">
            Achievements & Awards
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Competitions, hackathons, academic awards, and official certificates.
          </p>
        </div>
        <Link
          href="/admin/achievements/new"
          className="inline-flex items-center gap-2 h-9 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-600/25 transition-all whitespace-nowrap shrink-0 self-start sm:self-auto"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          New Achievement
        </Link>
      </div>

      {achievements.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-[#0c111e]/90 border border-slate-800/80">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <p className="text-base font-semibold text-slate-200">No achievements yet</p>
          <p className="text-sm text-slate-500 mt-1">Add your awards, honors, and certificates</p>
          <Link
            href="/admin/achievements/new"
            className="inline-flex items-center gap-2 h-9 px-5 mt-5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all"
          >
            Create First Achievement
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((a) => (
            <div
              key={a.id}
              className="rounded-2xl bg-[#0c111e]/90 border border-slate-800/80 p-6 hover:border-slate-700/80 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0">
                    <h2 className="text-base font-bold text-white leading-snug truncate">{a.title}</h2>
                    {a.issuer && (
                      <p className="text-xs font-semibold text-amber-400 mt-0.5 truncate">{a.issuer}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Link
                      href={`/admin/achievements/${a.id}/edit`}
                      className="h-8 px-2.5 inline-flex items-center text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-lg transition-all"
                    >
                      Edit
                    </Link>
                    <DeleteButton id={a.id} itemName={a.title} onDelete={deleteAchievementAction} />
                  </div>
                </div>

                {a.description && (
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-4">
                    {a.description}
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                <span className="text-xs text-slate-500">
                  {a.date ? formatDate(a.date) : "No date specified"}
                </span>
                {a.certificateUrl ? (
                  <a
                    href={a.certificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors inline-flex items-center gap-1"
                  >
                    Verify
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                ) : (
                  <span className="text-slate-600 text-xs">—</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
