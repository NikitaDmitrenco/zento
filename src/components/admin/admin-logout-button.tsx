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
      className="w-full h-10 rounded-sm border border-line text-[13px] font-medium text-danger hover:border-danger transition-colors cursor-pointer"
    >
      Выйти из аккаунта
    </button>
  );
}
