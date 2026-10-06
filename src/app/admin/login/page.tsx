import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminSession } from "@/lib/admin-auth";
import { AdminLoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Admin Login | Portfolio",
  description: "Secure login portal for portfolio administration.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLoginPage() {
  const adminSession = await getAdminSession();

  // Already authenticated as an active administrator.
  if (adminSession) {
    redirect("/admin");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-[460px] relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-extrabold text-white text-xl shadow-xl shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              P
            </div>
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight text-white font-[family-name:var(--font-title)]">
            Portfolio Administration
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Sign in with your administrator credentials
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-8 sm:p-10 shadow-2xl shadow-black/60">
          <AdminLoginForm />
        </div>

        {/* Footer info */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-xs font-medium text-slate-500 hover:text-slate-300 transition-colors inline-flex items-center gap-1.5"
          >
            <span>&larr;</span> Back to public portfolio
          </Link>
        </div>
      </div>
    </main>
  );
}