"use client";

export function AdminLogoutButton() {
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/ru/auth/login";
    } catch {
      //
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full text-center py-2 text-xs font-semibold text-red-400 hover:text-white hover:bg-red-500/20 bg-slate-800 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
    >
      🚪 Выйти из аккаунта
    </button>
  );
}
