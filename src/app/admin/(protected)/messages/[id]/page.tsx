import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteMessageAction } from "@/actions/admin-actions";

export const dynamic = "force-dynamic";

interface ViewMessagePageProps {
  params: Promise<{ id: string }>;
}

export default async function ViewMessagePage({ params }: ViewMessagePageProps) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id, 10);
  if (isNaN(id)) {
    notFound();
  }

  const msg = await prisma.message.findUnique({
    where: { id },
  });

  if (!msg) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* ── Top Navigation Bar ── */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/messages"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Back to inquiries"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-white font-[family-name:var(--font-title)]">
              Inquiry from {msg.name}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Received on {formatDate(msg.createdAt)}
            </p>
          </div>
        </div>

        <DeleteButton
          id={msg.id}
          itemName="this message"
          onDelete={deleteMessageAction}
          redirectAfterDelete="/admin/messages"
        />
      </div>

      {/* ── Main Message Card ── */}
      <div className="rounded-2xl bg-[#0c111e]/90 border border-slate-800/80 overflow-hidden shadow-sm">
        {/* Sender details */}
        <div className="p-6 bg-[#0a0f1c] border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-base font-bold text-indigo-300 shrink-0">
              {msg.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-base font-bold text-white leading-tight">{msg.name}</p>
              <a
                href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || "")}`}
                className="text-xs font-mono text-indigo-400 hover:underline mt-0.5 block"
              >
                {msg.email}
              </a>
            </div>
          </div>

          <a
            href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || "")}`}
            className="inline-flex items-center gap-2 h-9 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-600/25 transition-all self-start sm:self-auto"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Reply via Email
          </a>
        </div>

        {/* Subject & Message Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {msg.subject && (
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Subject
              </span>
              <p className="text-base font-semibold text-slate-200">
                {msg.subject}
              </p>
            </div>
          )}

          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
              Message Body
            </span>
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
              {msg.message}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
