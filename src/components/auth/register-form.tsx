"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Locale } from "../../i18n/config";
import { Dictionary } from "../../i18n/get-dictionary";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export function RegisterForm({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Failed to create account");
        setLoading(false);
        return;
      }

      router.push(`/${locale}`);
      router.refresh();
    } catch {
      setErrorMsg("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-medium">
          {errorMsg}
        </div>
      )}

      <Input
        label="Имя"
        type="text"
        required
        placeholder="Иван Петров"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <Input
        label="Email"
        type="email"
        required
        placeholder="ivanpetrov@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Input
        label="Пароль"
        type="password"
        required
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button
        type="submit"
        isLoading={loading}
        size="lg"
        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 text-sm mt-2"
      >
        Зарегистрироваться →
      </Button>

      <div className="text-center pt-2 text-xs text-slate-500">
        Уже есть аккаунт?{" "}
        <Link href={`/${locale}/auth/login`} className="font-semibold text-blue-600 hover:underline">
          Войти
        </Link>
      </div>
    </form>
  );
}
