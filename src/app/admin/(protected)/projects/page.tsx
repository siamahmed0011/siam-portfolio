import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/prisma";
import { getAssetUrl, formatDate } from "@/lib/utils";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteProjectAction } from "@/actions/admin-actions";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });

  const totalWithDemo = projects.filter((p) => p.demoUrl).length;
  const totalWithGithub = projects.filter((p) => p.githubUrl).length;

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight font-[family-name:var(--font-title)]">
            Projects Portfolio
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Create, edit, and organize showcase applications, repositories, and live demo links.
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 h-9 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-600/25 transition-all whitespace-nowrap shrink-0 self-start sm:self-auto"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          New Project
        </Link>
      </div>

      {/* ── Summary Metrics ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-4 rounded-xl bg-[#0c111e]/80 border border-slate-800/80 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Projects</p>
            <p className="text-2xl font-bold text-white mt-0.5 tabular-nums">{projects.length}</p>
          </div>
          <span className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#0c111e]/80 border border-slate-800/80 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Live Deployments</p>
            <p className="text-2xl font-bold text-emerald-400 mt-0.5 tabular-nums">{totalWithDemo}</p>
          </div>
          <span className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#0c111e]/80 border border-slate-800/80 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">GitHub Linked</p>
            <p className="text-2xl font-bold text-indigo-300 mt-0.5 tabular-nums">{totalWithGithub}</p>
          </div>
          <span className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </span>
        </div>
      </div>

      {/* ── Project List / Table ── */}
      {projects.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-[#0c111e]/90 border border-slate-800/80">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <p className="text-base font-semibold text-slate-200">No projects added yet</p>
          <p className="text-sm text-slate-500 mt-1">Showcase your first application</p>
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 h-9 px-5 mt-5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all"
          >
            Create First Project
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl bg-[#0c111e]/90 border border-slate-800/80 overflow-hidden shadow-sm">
          {/* Header Row */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3.5 bg-[#0a0f1c] border-b border-slate-800/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <div className="col-span-6 md:col-span-5">Project Details</div>
            <div className="col-span-3 hidden md:block">Stack & Info</div>
            <div className="col-span-2 hidden lg:block">External Links</div>
            <div className="col-span-6 md:col-span-4 lg:col-span-2 text-right">Actions</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-slate-800/60">
            {projects.map((p) => {
              const techList = p.techStack
                ? p.techStack.split(",").map((t) => t.trim()).filter(Boolean)
                : [];

              return (
                <div
                  key={p.id}
                  className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-800/30 transition-colors"
                >
                  {/* Thumbnail & Title */}
                  <div className="col-span-6 md:col-span-5 flex items-center gap-3.5 min-w-0">
                    <div className="w-16 h-12 rounded-xl overflow-hidden relative bg-slate-800 shrink-0 border border-slate-700/60 shadow-sm">
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
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-white text-sm truncate leading-tight">{p.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{formatDate(p.createdAt)}</p>
                    </div>
                  </div>

                  {/* Tech Stack Pills */}
                  <div className="col-span-3 hidden md:block min-w-0">
                    {techList.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {techList.slice(0, 3).map((tech, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                          >
                            {tech}
                          </span>
                        ))}
                        {techList.length > 3 && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                            +{techList.length - 3}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-600">No tech stack</span>
                    )}
                    {p.description && (
                      <p className="text-[11px] text-slate-400 truncate mt-1 max-w-xs">{p.description}</p>
                    )}
                  </div>

                  {/* Links */}
                  <div className="col-span-2 hidden lg:flex flex-col gap-1">
                    {p.githubUrl && (
                      <a
                        href={p.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-slate-400 hover:text-indigo-400 inline-flex items-center gap-1.5 transition-colors font-medium"
                      >
                        <svg className="w-3 h-3 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                        </svg>
                        GitHub Repo
                      </a>
                    )}
                    {p.demoUrl && (
                      <a
                        href={p.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-slate-400 hover:text-emerald-400 inline-flex items-center gap-1.5 transition-colors font-medium"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Live Demo
                      </a>
                    )}
                    {!p.githubUrl && !p.demoUrl && <span className="text-xs text-slate-600">—</span>}
                  </div>

                  {/* Actions */}
                  <div className="col-span-6 md:col-span-4 lg:col-span-2 flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/projects/${p.id}/edit`}
                      className="h-8 px-3 inline-flex items-center text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-all"
                    >
                      Edit
                    </Link>
                    <DeleteButton id={p.id} itemName={p.title} onDelete={deleteProjectAction} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
