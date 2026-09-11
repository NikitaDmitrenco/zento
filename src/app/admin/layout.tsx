import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "../../lib/auth/session";
import { fontClassName } from "../../lib/fonts";
import { AdminLogoutButton } from "../../components/admin/admin-logout-button";

export const metadata = {
  title: "Zento Admin Panel",
};

const navItems = [
  { href: "/admin", label: "Дашборд" },
  { href: "/admin/products", label: "Товары" },
  { href: "/admin/orders", label: "Заказы" },
  { href: "/admin/users", label: "Пользователи" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  // Server-side authorization check for ADMIN role
  if (!session || session.role !== "ADMIN") {
    redirect("/ru/auth/login?callbackUrl=/admin");
  }

  return (
    <html lang="ru" className={fontClassName}>
      <body className="bg-paper-2 text-ink font-sans min-h-screen flex flex-col md:flex-row">

        {/* Mobile top bar (below md): wordmark + ruled row of nav links, no JS */}
        <header className="md:hidden bg-paper border-b border-line px-5">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-baseline gap-2">
              <Link href="/admin" className="wordmark text-[22px]">
                zento
              </Link>
              <span className="label">admin</span>
            </div>
            <Link href="/ru" className="label text-ink hover:text-signal transition-colors duration-180">
              ← В магазин
            </Link>
          </div>
          <nav className="flex items-center gap-5 h-10 -mx-5 px-5 overflow-x-auto border-t border-line" aria-label="Admin">
            {navItems.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                className="label whitespace-nowrap text-ink-2 hover:text-ink transition-colors duration-180"
              >
                <span className="text-ink-3 mr-1.5">{String(i + 1).padStart(2, "0")}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </header>

        {/* Admin Sidebar (md and up) */}
        <aside className="hidden md:flex w-64 shrink-0 bg-paper border-r border-line flex-col justify-between p-6 md:sticky md:top-0 md:h-screen">
          <div className="space-y-8">
            <div className="flex items-baseline gap-2">
              <Link href="/admin" className="wordmark text-[26px]">
                zento
              </Link>
              <span className="label">admin</span>
            </div>

            <nav className="divide-y divide-line border-y border-line" aria-label="Admin">
              {navItems.map((item, i) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-4 py-3 text-small font-medium text-ink-2 hover:text-ink transition-colors duration-180"
                >
                  <span className="label w-6 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="pt-6 border-t border-line space-y-3">
            <div className="min-w-0">
              <p className="text-small font-medium text-ink truncate">{session.name}</p>
              <p className="data text-[12px] text-ink-3 truncate">{session.email}</p>
            </div>
            <Link
              href="/ru"
              className="inline-flex w-full items-center justify-center h-10 rounded-sm border border-ink text-[13px] font-medium text-ink hover:bg-ink hover:text-ink-inverse transition-colors duration-180"
            >
              ← В магазин
            </Link>
            <AdminLogoutButton />
          </div>
        </aside>

        {/* Admin Content Area */}
        <main className="flex-1 min-w-0 p-6 sm:p-10 overflow-y-auto">
          {children}
        </main>

      </body>
    </html>
  );
}
