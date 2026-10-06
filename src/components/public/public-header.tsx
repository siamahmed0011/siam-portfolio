"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface PublicHeaderProps {
  siteName?: string;
}

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/academic", label: "Academic" },
  { href: "/skills", label: "Skills" },
  { href: "/achievements", label: "Achievements" },
  { href: "/contact", label: "Contact" },
];

export function PublicHeader({ siteName = "Shiam Ahmed" }: PublicHeaderProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand-name">
          {siteName}
        </Link>

        <button
          className="menu-toggle"
          id="menuToggle"
          aria-label="Toggle Menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg viewBox="0 0 24 24" width="24" height="24">
            {mobileMenuOpen ? (
              <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            ) : (
              <path fill="currentColor" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
            )}
          </svg>
        </button>

        <nav className={`nav-links ${mobileMenuOpen ? "active" : ""}`}>
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname === link.href || pathname.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={isActive ? "active-link" : ""}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
