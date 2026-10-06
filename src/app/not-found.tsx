import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex items-center justify-center p-4">
      <div className="text-center max-w-md p-8 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mx-auto flex items-center justify-center font-bold text-2xl">
          404
        </div>
        <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-title)]">
          Page Not Found
        </h1>
        <p className="text-sm text-slate-400">
          The page you are looking for does not exist or may have moved.
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-md shadow-indigo-600/25 transition-all"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
