import Link from "next/link";
import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteMessageAction } from "@/actions/admin-actions";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const messages = await prisma.message.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight font-[family-name:var(--font-title)]">
            Contact Inquiries
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Review, reply, and manage messages sent from your public portfolio contact form.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs font-bold">
            {messages.length} {messages.length === 1 ? "Inquiry" : "Inquiries"} Total
          </span>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-[#0c111e]/90 border border-slate-800/80">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-base font-semibold text-slate-200">No inquiries yet</p>
          <p className="text-sm text-slate-500 mt-1">When visitors contact you from your portfolio, messages appear here</p>
        </div>
      ) : (
        <div className="rounded-2xl bg-[#0c111e]/90 border border-slate-800/80 overflow-hidden shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-3.5 bg-[#0a0f1c] border-b border-slate-800/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <span>Sender & Message Content</span>
            <span>Actions</span>
          </div>

          {/* Inquiry Rows */}
          <div className="divide-y divide-slate-800/60">
            {messages.map((m) => (
              <div
                key={m.id}
                className="flex items-center gap-4 px-6 py-4.5 hover:bg-slate-800/30 transition-colors"
              >
                {/* Avatar Icon */}
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-300 shrink-0">
                  {m.name.charAt(0).toUpperCase()}
                </div>

                {/* Sender Info & Preview */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline flex-wrap gap-x-3 gap-y-1">
                    <span className="text-sm font-bold text-white leading-tight">{m.name}</span>
                    <a
                      href={`mailto:${m.email}`}
                      className="text-xs text-indigo-400 hover:underline font-mono"
                    >
                      {m.email}
                    </a>
                    <span className="text-[11px] text-slate-500 ml-auto whitespace-nowrap">
                      {formatDate(m.createdAt)}
                    </span>
                  </div>

                  {m.subject && (
                    <p className="text-xs font-semibold text-slate-300 mt-1 truncate">
                      Subject: {m.subject}
                    </p>
                  )}
                  <p className="text-xs text-slate-400 truncate mt-0.5 max-w-2xl">{m.message}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/admin/messages/${m.id}`}
                    className="h-8 px-3.5 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-300 bg-indigo-600/15 hover:bg-indigo-600/25 border border-indigo-500/30 rounded-lg transition-all whitespace-nowrap"
                  >
                    <span>View & Reply</span>
                  </Link>
                  <DeleteButton id={m.id} itemName={`message from ${m.name}`} onDelete={deleteMessageAction} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
