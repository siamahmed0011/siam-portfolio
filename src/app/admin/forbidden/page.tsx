import Link from "next/link";

export default function AdminForbiddenPage() {
  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-rose-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md rounded-2xl border border-slate-800/90 bg-slate-900/90 p-8 sm:p-10 text-center shadow-2xl relative z-10 space-y-6">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shadow-inner">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-title)]">
            Access Denied
          </h1>
          <p className="mt-2 text-sm text-slate-400 leading-relaxed">
            Your account does not have administrator privileges to access this control panel.
          </p>
        </div>

        <div className="pt-2 flex flex-col gap-3">
          <Link
            href="/"
            className="h-11 inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all hover:bg-indigo-500"
          >
            Return to Portfolio
          </Link>
          <Link
            href="/admin/login"
            className="h-11 inline-flex items-center justify-center rounded-xl bg-slate-800 px-6 text-sm font-semibold text-slate-300 border border-slate-700 hover:bg-slate-700 transition-colors"
          >
            Sign in with Another Account
          </Link>
        </div>
      </div>
    </main>
  );
}