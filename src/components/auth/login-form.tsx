"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Locale } from "../../i18n/config";
import { Dictionary } from "../../i18n/get-dictionary";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Alert } from "../ui/alert";

export function LoginForm({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Only allow same-origin, path-relative redirects to prevent open-redirect phishing.
  const rawCallback = searchParams.get("callbackUrl");
  const callbackUrl =
    rawCallback && rawCallback.startsWith("/") && !rawCallback.startsWith("//") && !rawCallback.startsWith("/\\")
      ? rawCallback
      : `/${locale}`;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Failed to sign in");
        setLoading(false);
        return;
      }

      // Check if logged in user is admin and redirecting to admin
      if (data.user?.role === "ADMIN" && callbackUrl.includes("/admin")) {
        router.push("/admin");
      } else {
        router.push(callbackUrl);
      }
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
        {dict.common.login}
        <span className="arrow" aria-hidden="true">→</span>
      </Button>

      <div className="text-center pt-2 text-small text-ink-2">
        Ещё нет аккаунта?{" "}
        <Link href={`/${locale}/auth/register`} className="link text-ink">
          Зарегистрироваться
        </Link>
      </div>
    </form>
  );
}
