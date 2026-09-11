"use client";

import { useState } from "react";
import Link from "next/link";
import { Locale } from "../../i18n/config";
import { Dictionary } from "../../i18n/get-dictionary";
import { LanguageSwitcher } from "./language-switcher";

const navLink =
  "relative py-1 text-sm font-medium text-ink-2 hover:text-ink transition-colors duration-180 " +
  "after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-full after:bg-ink after:scale-x-0 after:origin-left " +
  "after:transition-transform after:duration-180 hover:after:scale-x-100";

export function Header({
  locale,
  dict,
  user,
  cartCount = 0,
}: {
  locale: Locale;
  dict: Dictionary;
  user?: { name: string; email: string; role: "USER" | "ADMIN" } | null;
  cartCount?: number;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = `/${locale}`;
    } catch {
      //
    }
  };

  const links = [
    { href: `/${locale}/catalog`, label: dict.nav.catalog },
    { href: `/${locale}/catalog?category=smartphones`, label: dict.nav.smartphones },
    { href: `/${locale}/catalog?category=laptops`, label: dict.nav.laptops },
    { href: `/${locale}/catalog?category=headphones`, label: dict.nav.headphones },
  ];

  return (
    <header className="sticky top-0 z-40 bg-paper/95 backdrop-blur-[2px] border-b border-line">
      <div className="container-x">
        <div className="flex items-center justify-between h-16 gap-6">
          {/* Wordmark */}
          <Link href={`/${locale}`} className="wordmark text-[26px] shrink-0" aria-label={dict.common.brand}>
            zento
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className={navLink}>
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            <LanguageSwitcher currentLocale={locale} />

            {/* Cart */}
            <Link
              href={`/${locale}/cart`}
              className="group inline-flex items-center gap-1.5 h-8 px-2 -mr-1 text-ink-2 hover:text-ink transition-colors duration-180"
              aria-label={dict.common.cart}
            >
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 5h2l1.6 10.5a1 1 0 001 .85h8.9a1 1 0 001-.8L20 8H7" />
                <circle cx="9.5" cy="20" r="1" fill="currentColor" />
                <circle cx="17" cy="20" r="1" fill="currentColor" />
              </svg>
              {cartCount > 0 && (
                <span className="data text-[11px] font-medium text-ink-inverse bg-signal min-w-4.5 h-4.5 px-1 rounded-full inline-flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth state */}
            {user ? (
              <div className="hidden sm:flex items-center gap-3 border-l border-line pl-4 h-8">
                <span className="text-[13px] font-medium text-ink inline-flex items-center gap-2 max-w-40 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-ok shrink-0" aria-hidden="true" />
                  {user.name}
                </span>
                {user.role === "ADMIN" && (
                  <Link
                    href={`/admin`}
                    className="label h-7 inline-flex items-center px-2 rounded-xs bg-signal-soft text-signal-strong hover:bg-signal hover:text-white transition-colors duration-180"
                  >
                    {dict.common.admin}
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-[13px] font-medium text-ink-3 hover:text-danger transition-colors duration-180 cursor-pointer"
                  title={dict.common.logout}
                >
                  {dict.common.logout}
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-4 border-l border-line pl-4 h-8">
                <Link
                  href={`/${locale}/auth/login`}
                  className="text-[13px] font-medium text-ink-2 hover:text-ink transition-colors duration-180"
                >
                  {dict.common.login}
                </Link>
                <Link
                  href={`/${locale}/auth/register`}
                  className="inline-flex items-center h-8 px-3.5 rounded-sm bg-ink text-ink-inverse text-[13px] font-medium hover:bg-signal transition-colors duration-180"
                >
                  {dict.common.register}
                </Link>
              </div>
            )}

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden inline-flex items-center justify-center w-9 h-9 -mr-2 text-ink cursor-pointer"
              aria-label="Toggle Navigation"
              aria-expanded={mobileMenuOpen}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" d="M3 7h18M3 12h18M3 17h18" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-line -mx-5 sm:-mx-8 px-5 sm:px-8 pb-5 bg-paper">
            <nav className="divide-y divide-line">
              {links.map((l, i) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-3.5 text-[15px] font-medium text-ink"
                >
                  <span>{l.label}</span>
                  <span className="label">{String(i + 1).padStart(2, "0")}</span>
                </Link>
              ))}
            </nav>

            <div className="pt-4 border-t border-line-strong">
              {user ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between text-[13px] font-medium text-ink">
                    <span className="inline-flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-ok" aria-hidden="true" />
                      {user.name}
                    </span>
                    {user.role === "ADMIN" && (
                      <Link
                        href="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="label h-7 inline-flex items-center px-2 rounded-xs bg-signal-soft text-signal-strong"
                      >
                        {dict.common.admin}
                      </Link>
                    )}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="h-10 w-full rounded-sm border border-line text-[13px] font-medium text-danger hover:border-danger transition-colors cursor-pointer"
                  >
                    {dict.common.logout}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href={`/${locale}/auth/login`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex items-center justify-center h-10 rounded-sm border border-ink text-[13px] font-medium text-ink"
                  >
                    {dict.common.login}
                  </Link>
                  <Link
                    href={`/${locale}/auth/register`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex items-center justify-center h-10 rounded-sm bg-ink text-ink-inverse text-[13px] font-medium"
                  >
                    {dict.common.register}
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
