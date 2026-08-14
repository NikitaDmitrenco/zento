"use client";

import { useState } from "react";
import Link from "next/link";
import { Locale } from "../../i18n/config";
import { Dictionary } from "../../i18n/get-dictionary";
import { LanguageSwitcher } from "./language-switcher";

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

  return (
    <header className="sticky top-0 z-40 glass-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2 group">
            <span className="text-2xl font-black tracking-tighter text-slate-900 font-sans lowercase group-hover:opacity-80 transition-opacity">
              zento<span className="text-blue-600">.</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-700">
            <Link
              href={`/${locale}/catalog`}
              className="hover:text-slate-900 transition-colors"
            >
              {dict.nav.catalog}
            </Link>
            <Link
              href={`/${locale}/catalog?category=smartphones`}
              className="hover:text-slate-900 transition-colors"
            >
              {dict.nav.smartphones}
            </Link>
            <Link
              href={`/${locale}/catalog?category=laptops`}
              className="hover:text-slate-900 transition-colors"
            >
              {dict.nav.laptops}
            </Link>
            <Link
              href={`/${locale}/catalog?category=headphones`}
              className="hover:text-slate-900 transition-colors"
            >
              {dict.nav.headphones}
            </Link>

            {/* My Orders Button (Visible ONLY when user is signed in) */}
            {user && (
              <Link
                href={`/${locale}/orders`}
                className="hover:text-blue-700 transition-colors flex items-center gap-1 font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100"
              >
                📦 Мои заказы
              </Link>
            )}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            
            {/* Language Switcher */}
            <LanguageSwitcher currentLocale={locale} />

            {/* Cart Icon */}
            <Link
              href={`/${locale}/cart`}
              className="relative p-2 text-slate-700 hover:text-slate-900 transition-colors rounded-lg hover:bg-slate-100"
              aria-label={dict.common.cart}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                ></path>
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-slate-900 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Auth state & Logout */}
            {user ? (
              <div className="hidden sm:flex items-center gap-3 border-l border-slate-200 pl-3">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  {user.name}
                </span>
                {user.role === "ADMIN" && (
                  <Link
                    href={`/admin`}
                    className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md hover:bg-blue-100 transition-colors"
                  >
                    🛡️ {dict.common.admin}
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-xs font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 px-2.5 py-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1"
                  title="Выйти из аккаунта"
                >
                  🚪 Выйти
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2 border-l border-slate-200 pl-3">
                <Link
                  href={`/${locale}/auth/login`}
                  className="text-xs font-medium text-slate-700 hover:text-slate-900 px-2.5 py-1.5 rounded-md hover:bg-slate-100 transition-colors"
                >
                  {dict.common.login}
                </Link>
                <Link
                  href={`/${locale}/auth/register`}
                  className="text-xs font-medium bg-slate-900 text-white px-3 py-1.5 rounded-md hover:bg-slate-800 transition-colors"
                >
                  {dict.common.register}
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Toggle Navigation"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 py-4 px-2 space-y-3 bg-white">
            <Link
              href={`/${locale}/catalog`}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 rounded-lg"
            >
              {dict.nav.catalog}
            </Link>
            <Link
              href={`/${locale}/catalog?category=smartphones`}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg"
            >
              {dict.nav.smartphones}
            </Link>
            <Link
              href={`/${locale}/catalog?category=laptops`}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg"
            >
              {dict.nav.laptops}
            </Link>
            <Link
              href={`/${locale}/catalog?category=headphones`}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg"
            >
              {dict.nav.headphones}
            </Link>

            {user && (
              <Link
                href={`/${locale}/orders`}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-semibold text-blue-600 bg-blue-50 rounded-lg"
              >
                📦 Мои заказы
              </Link>
            )}

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              {user ? (
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>👤 {user.name}</span>
                    {user.role === "ADMIN" && (
                      <Link
                        href="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded"
                      >
                        🛡️ {dict.common.admin}
                      </Link>
                    )}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-center py-2 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors cursor-pointer"
                  >
                    🚪 Выйти из аккаунта
                  </button>
                </div>
              ) : (
                <div className="flex gap-2 w-full">
                  <Link
                    href={`/${locale}/auth/login`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center py-2 text-xs font-medium text-slate-700 bg-slate-100 rounded-md"
                  >
                    {dict.common.login}
                  </Link>
                  <Link
                    href={`/${locale}/auth/register`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center py-2 text-xs font-medium text-white bg-slate-900 rounded-md"
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
