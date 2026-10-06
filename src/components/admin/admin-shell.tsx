"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import type { User } from "@/lib/auth";

interface AdminShellProps {
  user: User;
  children: ReactNode;
}

interface NavItem {
  label: string;
  href: string;
  icon: (active: boolean) => ReactNode;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/admin",
        icon: (active) => (
          <svg className={`w-5 h-5 shrink-0 transition-colors ${active ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-200"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        ),
      },
    ],
  },
  {
    title: "Portfolio Content",
    items: [
      {
        label: "Projects",
        href: "/admin/projects",
        icon: (active) => (
          <svg className={`w-5 h-5 shrink-0 transition-colors ${active ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-200"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        ),
      },
      {
        label: "Skills & Stack",
        href: "/admin/skills",
        icon: (active) => (
          <svg className={`w-5 h-5 shrink-0 transition-colors ${active ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-200"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        ),
      },
      {
        label: "Academics",
        href: "/admin/academics",
        icon: (active) => (
          <svg className={`w-5 h-5 shrink-0 transition-colors ${active ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-200"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5" />
          </svg>
        ),
      },
      {
        label: "Achievements",
        href: "/admin/achievements",
        icon: (active) => (
          <svg className={`w-5 h-5 shrink-0 transition-colors ${active ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-200"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        ),
      },
    ],
  },
  {
    title: "System & Inbox",
    items: [
      {
        label: "Messages Inbox",
        href: "/admin/messages",
        icon: (active) => (
          <svg className={`w-5 h-5 shrink-0 transition-colors ${active ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-200"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        ),
      },
      {
        label: "Site Settings",
        href: "/admin/settings",
        icon: (active) => (
          <svg className={`w-5 h-5 shrink-0 transition-colors ${active ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-200"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        ),
      },
    ],
  },
];

function getBreadcrumb(pathname: string) {
  if (pathname === "/admin") return { section: "Overview", title: "Dashboard Overview" };
  if (pathname === "/admin/projects") return { section: "Content", title: "Projects Portfolio" };
  if (pathname === "/admin/projects/new") return { section: "Projects", title: "Create New Project" };
  if (pathname.startsWith("/admin/projects/") && pathname.endsWith("/edit")) return { section: "Projects", title: "Edit Project" };
  if (pathname === "/admin/skills") return { section: "Content", title: "Skills & Technical Stack" };
  if (pathname === "/admin/skills/new") return { section: "Skills", title: "Create Skill Group" };
  if (pathname.startsWith("/admin/skills/") && pathname.endsWith("/edit")) return { section: "Skills", title: "Edit Skill Group" };
  if (pathname === "/admin/academics") return { section: "Content", title: "Academic Journey" };
  if (pathname === "/admin/academics/new") return { section: "Academics", title: "Add Academic Record" };
  if (pathname.startsWith("/admin/academics/") && pathname.endsWith("/edit")) return { section: "Academics", title: "Edit Academic Record" };
  if (pathname === "/admin/achievements") return { section: "Content", title: "Achievements & Awards" };
  if (pathname === "/admin/achievements/new") return { section: "Achievements", title: "Add Achievement" };
  if (pathname.startsWith("/admin/achievements/") && pathname.endsWith("/edit")) return { section: "Achievements", title: "Edit Achievement" };
  if (pathname === "/admin/messages") return { section: "Inbox", title: "Contact Inquiries" };
  if (pathname.startsWith("/admin/messages/")) return { section: "Inbox", title: "Message Details" };
  if (pathname === "/admin/settings") return { section: "System", title: "Site Settings" };
  return { section: "Admin", title: "Console" };
}

export function AdminShell({ user, children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("portfolio_admin_sidebar_collapsed") === "true";
    }
    return false;
  });
  const [loggingOut, setLoggingOut] = useState(false);

  function toggleSidebar() {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("portfolio_admin_sidebar_collapsed", String(next));
      return next;
    });
  }

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await authClient.signOut();
      router.push("/admin/login");
      router.refresh();
    } catch {
      setLoggingOut(false);
    }
  }

  const userInitial = user.name ? user.name.charAt(0).toUpperCase() : "A";
  const { section, title } = getBreadcrumb(pathname);
  const sidebarWidth = sidebarCollapsed ? 72 : 260;

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* ── Mobile Header ── */}
      <header className="md:hidden flex items-center justify-between px-4 h-16 bg-[#0c101c] border-b border-slate-800 sticky top-0 z-40">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center font-bold text-white text-sm shadow-md shadow-indigo-500/25">
            P
          </div>
          <div>
            <span className="font-bold text-white text-sm leading-tight block">Portfolio Hub</span>
            <span className="text-[10px] text-indigo-400 font-semibold tracking-wider uppercase block">Admin</span>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white border border-slate-700"
            title="Live Site"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-[#070b14]/98 backdrop-blur-2xl z-50 overflow-y-auto border-t border-slate-800 p-5 space-y-6">
          {NAV_SECTIONS.map((sec) => (
            <div key={sec.title} className="space-y-1.5">
              <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                {sec.title}
              </p>
              {sec.items.map((item) => {
                const isActive = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3.5 h-11 rounded-xl font-medium text-sm transition-all ${
                      isActive
                        ? "bg-indigo-600/15 text-indigo-300 font-semibold border border-indigo-500/30"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                    }`}
                  >
                    <span>{item.icon(isActive)}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}

          <div className="pt-5 border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-bold text-xs flex items-center justify-center">
                {userInitial}
              </div>
              <div>
                <p className="text-xs font-semibold text-white">{user.name}</p>
                <p className="text-[10px] text-slate-500">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="px-3 py-1.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {/* ── Desktop Layout with Full-Width Responsive Area ── */}
      <div className="hidden md:flex min-h-screen">
        {/* Collapsible Sidebar */}
        <aside
          style={{ width: `${sidebarWidth}px` }}
          className="fixed top-0 left-0 bottom-0 h-screen bg-[#090d18] border-r border-slate-800 flex flex-col z-30 select-none transition-all duration-300 ease-in-out overflow-hidden"
        >
          {/* Brand Header */}
          <div className={`h-16 flex items-center border-b border-slate-800 bg-[#090d18] shrink-0 transition-all ${
            sidebarCollapsed ? "justify-center px-2" : "justify-between px-5"
          }`}>
            <Link href="/admin" className="flex items-center gap-3 group overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center font-extrabold text-white text-base shadow-md shadow-indigo-500/25 shrink-0 group-hover:scale-105 transition-transform">
                P
              </div>
              {!sidebarCollapsed && (
                <div className="min-w-0 transition-opacity duration-200">
                  <span className="font-bold text-slate-100 text-sm tracking-tight leading-tight block truncate group-hover:text-indigo-300">
                    Portfolio Hub
                  </span>
                  <span className="text-[10px] text-indigo-400 font-semibold tracking-wider uppercase block">
                    Console v2.0
                  </span>
                </div>
              )}
            </Link>

            {!sidebarCollapsed && (
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-semibold text-emerald-400 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live
              </div>
            )}
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto custom-scrollbar">
            {NAV_SECTIONS.map((sec) => (
              <div key={sec.title} className="space-y-1">
                {!sidebarCollapsed && (
                  <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 truncate">
                    {sec.title}
                  </p>
                )}
                {sec.items.map((item) => {
                  const isActive = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={sidebarCollapsed ? item.label : undefined}
                      className={`group flex items-center h-10 rounded-xl text-xs font-semibold transition-all duration-150 ${
                        sidebarCollapsed ? "justify-center px-0 w-full" : "gap-3 px-3.5"
                      } ${
                        isActive
                          ? "bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-sm"
                          : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                      }`}
                    >
                      <span className={isActive ? "text-indigo-400" : ""}>{item.icon(isActive)}</span>
                      {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* Footer User & Actions */}
          <div className="p-3 border-t border-slate-800 bg-[#070a13] space-y-2 shrink-0">
            <Link
              href="/"
              target="_blank"
              title="View Live Website"
              className={`flex items-center justify-center h-8 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-[11px] font-semibold text-slate-300 hover:text-white transition-all border border-slate-700 shadow-sm ${
                sidebarCollapsed ? "w-full px-0" : "gap-2 w-full px-3"
              }`}
            >
              <svg className="w-3.5 h-3.5 text-indigo-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              {!sidebarCollapsed && <span>View Website</span>}
            </Link>

            <div className={`flex items-center p-2 rounded-lg bg-slate-900/90 border border-slate-800 ${
              sidebarCollapsed ? "justify-center" : "justify-between"
            }`}>
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500/20 to-violet-500/20 text-indigo-400 border border-indigo-500/30 font-bold text-xs flex items-center justify-center shrink-0">
                  {userInitial}
                </div>
                {!sidebarCollapsed && (
                  <div className="truncate">
                    <p className="text-[11px] font-bold text-slate-200 truncate leading-tight">{user.name}</p>
                    <p className="text-[9px] text-slate-500 truncate leading-tight">{user.email}</p>
                  </div>
                )}
              </div>
              {!sidebarCollapsed && (
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors shrink-0"
                  title="Sign Out"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content Area — Full-width flex-1 */}
        <div
          style={{ marginLeft: `${sidebarWidth}px` }}
          className="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out"
        >
          {/* Top Sticky Header */}
          <header className="sticky top-0 z-20 h-16 bg-[#070b14]/90 backdrop-blur-xl border-b border-slate-800 px-6 lg:px-10 flex items-center justify-between">
            {/* Left: Sidebar Toggle Button + Breadcrumbs */}
            <div className="flex items-center gap-3.5">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer shadow-sm"
                title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {sidebarCollapsed ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                  )}
                </svg>
              </button>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 font-medium">{section}</span>
                <span className="text-slate-700">/</span>
                <span className="text-slate-200 font-bold">{title}</span>
              </div>
            </div>

            {/* Right: Quick Settings Shortcut */}
            <div className="flex items-center gap-3">
              <Link
                href="/admin/settings"
                className="flex items-center gap-1.5 px-3 h-8 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/70 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors"
              >
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                </svg>
                Settings
              </Link>
            </div>
          </header>

          {/* Full-width responsive main workspace */}
          <main className="flex-1 px-6 lg:px-10 py-8 w-full">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile main content */}
      <div className="md:hidden">
        <main className="px-4 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
