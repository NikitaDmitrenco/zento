import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "../../lib/auth/session";
import { AdminLogoutButton } from "../../components/admin/admin-logout-button";

export const metadata = {
  title: "Zento Admin Panel",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  // Server-side authorization check for ADMIN role
  if (!session || session.role !== "ADMIN") {
    redirect("/ru/auth/login?callbackUrl=/admin");
  }

  return (
    <html lang="ru">
      <body className="bg-slate-100 text-slate-900 font-sans antialiased min-h-screen flex">
        
        {/* Admin Sidebar */}
        <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between p-6 flex-shrink-0">
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <Link href="/admin" className="text-xl font-black tracking-tighter text-white font-sans lowercase">
                zento<span className="text-blue-500">.</span>admin
              </Link>
            </div>

            <nav className="space-y-1 text-xs font-semibold">
              <Link
                href="/admin"
                className="block px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                📊 Дашборд
              </Link>
              <Link
                href="/admin/products"
                className="block px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                📦 Товары
              </Link>
              <Link
                href="/admin/orders"
                className="block px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                🛒 Заказы
              </Link>
              <Link
                href="/admin/users"
                className="block px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                👥 Пользователи
              </Link>
            </nav>
          </div>

          <div className="pt-6 border-t border-slate-800 space-y-3">
            <div className="text-xs">
              <p className="font-bold text-white truncate">{session.name}</p>
              <p className="text-slate-400 text-[10px] truncate">{session.email}</p>
            </div>
            <Link
              href="/ru"
              className="block text-center py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors"
            >
              ← В магазин
            </Link>
            <AdminLogoutButton />
          </div>
        </aside>

        {/* Admin Content Area */}
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>

      </body>
    </html>
  );
}
