"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await authClient.signIn.email({
        email,
        password,
      });

      if (res.error) {
        setError("Invalid email or password. Please check your credentials.");
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("An unexpected error occurred during sign-in. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-500/30 bg-red-950/70 p-4 text-sm font-medium text-red-300 flex items-start gap-3 animate-in fade-in duration-200"
        >
          <svg
            className="w-5 h-5 text-red-400 shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span className="leading-relaxed">{error}</span>
        </div>
      )}

      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
        >
          Admin Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          placeholder="admin@example.com"
          className="block w-full h-12 rounded-xl border border-slate-700 bg-slate-800/90 px-4 text-sm text-white placeholder:text-slate-500 shadow-inner transition-all duration-150 focus:border-indigo-500 focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 disabled:opacity-50"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          placeholder="••••••••••••"
          className="block w-full h-12 rounded-xl border border-slate-700 bg-slate-800/90 px-4 text-sm text-white placeholder:text-slate-500 shadow-inner transition-all duration-150 focus:border-indigo-500 focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 disabled:opacity-50"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex w-full h-12 cursor-pointer items-center justify-center rounded-xl bg-indigo-600 px-6 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 transition-all duration-150 hover:bg-indigo-500 hover:shadow-indigo-600/40 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <svg
              className="h-4 w-4 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Signing In...
          </span>
        ) : (
          "Sign In to Admin"
        )}
      </button>
    </form>
  );
}
