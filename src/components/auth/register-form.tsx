"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Locale } from "../../i18n/config";
import { Dictionary } from "../../i18n/get-dictionary";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Alert } from "../ui/alert";

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
    <form onSubmit={handleSubmit} className="space-y-5">
      {errorMsg && <Alert tone="error">{errorMsg}</Alert>}

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

      <Button type="submit" isLoading={loading} size="lg" className="w-full mt-2">
        Зарегистрироваться
        <span className="arrow" aria-hidden="true">→</span>
      </Button>

      <div className="text-center pt-2 text-small text-ink-2">
        Уже есть аккаунт?{" "}
        <Link href={`/${locale}/auth/login`} className="link text-ink">
          Войти
        </Link>
      </div>
    </form>
  );
}
