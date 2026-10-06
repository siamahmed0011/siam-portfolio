import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/prisma";
import { formatDate, getAssetUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [
    projectsCount,
    skillsCount,
    academicsCount,
    achievementsCount,
    messagesCount,
    recentProjects,
    recentMessages,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.skill.count(),
    prisma.academic.count(),
    prisma.achievement.count(),
    prisma.message.count(),
    prisma.project.findMany({ take: 5, orderBy: { createdAt: "desc" } }),
    prisma.message.findMany({ take: 5, orderBy: { createdAt: "desc" } }),
  ]);

  const stats = [
    {
      label: "Projects",
      value: projectsCount,
      sub: "Showcase items",
      href: "/admin/projects",
      iconColor: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      label: "Skill Groups",
      value: skillsCount,
      sub: "Tech categories",
      href: "/admin/skills",
      iconColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      label: "Academics",
      value: academicsCount,
      sub: "Degrees & records",
      href: "/admin/academics",
      iconColor: "text-sky-400 bg-sky-500/10 border-sky-500/20",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5" />
        </svg>
      ),
    },
    {
      label: "Achievements",
      value: achievementsCount,
      sub: "Awards & honors",
      href: "/admin/achievements",
      iconColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
    },
    {
      label: "Messages",
      value: messagesCount,
      sub: "Inbox inquiries",
      href: "/admin/messages",
      iconColor: "text-purple-400 bg-purple-500/10 border-purple-500/20",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-7 max-w-7xl mx-auto">
      {/* ── Clean Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight font-[family-name:var(--font-title)]">
            Dashboard Overview
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage and update your portfolio content, projects, and messages.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 h-10 px-5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/25 transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Add Project
          </Link>

          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 h-10 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-all cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Live Site
          </Link>
        </div>
      </div>

      {/* ── 5 Clean Metric Stat Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group flex flex-col justify-between rounded-2xl bg-[#0e1424] border border-slate-800 p-5 hover:border-slate-700 hover:bg-[#11192e] transition-all duration-200 hover:-translate-y-0.5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <span className={`w-10 h-10 rounded-xl border flex items-center justify-center ${stat.iconColor}`}>
                {stat.icon}
              </span>
              <svg className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>

            <div>
              <div className="text-3xl font-extrabold text-white tracking-tight tabular-nums">
                {stat.value}
              </div>
              <div className="text-sm font-bold text-slate-200 mt-1">{stat.label}</div>
              <div className="text-xs text-slate-500 mt-0.5">{stat.sub}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* ── 50/50 Balanced 2-Column Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Recent Projects (50% Width) */}
        <div className="rounded-2xl border border-slate-800 bg-[#0e1424] overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-800 bg-[#0a0f1d]">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              <h2 className="text-base font-bold text-white tracking-tight">Recent Projects</h2>
            </div>
            <Link
              href="/admin/projects"
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors inline-flex items-center gap-1"
            >
              View all ({projectsCount}) →
            </Link>
          </div>

          <div className="p-4">
            {recentProjects.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-xs text-slate-500">No projects added yet.</p>
                <Link href="/admin/projects/new" className="text-xs text-indigo-400 hover:underline mt-1.5 inline-block font-semibold">
                  + Create your first project
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentProjects.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-4 p-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/60 border border-slate-800 hover:border-slate-700 transition-all"
                  >
                    {/* Thumbnail */}
                    <div className="w-16 h-12 rounded-xl overflow-hidden relative bg-slate-800 shrink-0 border border-slate-700 shadow-sm">
                      {p.image ? (
                        <Image src={getAssetUrl(p.image)} alt={p.title} fill className="object-cover" unoptimized />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-600">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="text-sm font-bold text-white truncate">{p.title}</p>
                        <span className="text-[10px] text-slate-500 shrink-0">{formatDate(p.createdAt)}</span>
                      </div>
                      <p className="text-xs text-indigo-400 truncate mt-0.5">{p.techStack || "No stack specified"}</p>
                    </div>

                    {/* Action */}
                    <Link
                      href={`/admin/projects/${p.id}/edit`}
                      className="h-8 px-3.5 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-all shrink-0 inline-flex items-center"
                    >
                      Edit
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Messages (50% Width) */}
        <div className="rounded-2xl border border-slate-800 bg-[#0e1424] overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-800 bg-[#0a0f1d]">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              <h2 className="text-base font-bold text-white tracking-tight">Recent Inquiries</h2>
            </div>
            <Link
              href="/admin/messages"
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors inline-flex items-center gap-1"
            >
              View all ({messagesCount}) →
            </Link>
          </div>

          <div className="p-4">
            {recentMessages.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-xs text-slate-500">No contact inquiries yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentMessages.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center gap-4 p-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/60 border border-slate-800 hover:border-slate-700 transition-all"
                  >
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-300 shrink-0">
                      {m.name.charAt(0).toUpperCase()}
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="text-sm font-bold text-white truncate">{m.name}</p>
                        <span className="text-[10px] text-slate-500 shrink-0">{formatDate(m.createdAt)}</span>
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5">{m.subject || m.message}</p>
                    </div>

                    {/* Action */}
                    <Link
                      href={`/admin/messages/${m.id}`}
                      className="h-8 px-3.5 text-xs font-semibold text-indigo-300 bg-indigo-600/15 hover:bg-indigo-600/25 rounded-lg border border-indigo-500/30 transition-all shrink-0 inline-flex items-center"
                    >
                      Read
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
