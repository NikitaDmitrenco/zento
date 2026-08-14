import React from "react";
import { notFound } from "next/navigation";
import { isValidLocale, Locale } from "../../i18n/config";
import { getDictionary } from "../../i18n/get-dictionary";
import { getSession } from "../../lib/auth/session";
import { Header } from "../../components/layout/header";
import { Footer } from "../../components/layout/footer";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = await getDictionary(locale);

  return {
    title: {
      default: `${dict.common.brand} — ${dict.common.tagline}`,
      template: `%s | Zento`,
    },
    description: dict.home.heroSubtitle,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const dict = await getDictionary(locale);
  const session = await getSession();

  return (
    <html lang={locale} className="h-full">
      <body className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
        <Header locale={locale} dict={dict} user={session} />
        <div className="flex-grow">{children}</div>
        <Footer locale={locale} dict={dict} />
      </body>
    </html>
  );
}
