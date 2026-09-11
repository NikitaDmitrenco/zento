import { notFound } from "next/navigation";
import { isValidLocale, Locale } from "../../../../i18n/config";
import { getDictionary } from "../../../../i18n/get-dictionary";
import { Card } from "../../../../components/ui/card";
import { LoginForm } from "../../../../components/auth/login-form";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = await getDictionary(locale);

  return {
    title: dict.common.login,
  };
}

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const dict = await getDictionary(locale as Locale);

  return (
    <main className="container-x pt-12 sm:pt-20 pb-8">
      <div className="grid lg:grid-cols-12 gap-10 items-start">
        {/* Index + title */}
        <div className="lg:col-span-5">
          <p className="label">N° 01 — Войдите в свой аккаунт Zento</p>
          <h1 className="text-h1 text-ink mt-4">{dict.common.login}</h1>

          <ul className="mt-8 border-t border-line divide-y divide-line">
            {[dict.product.guarantee, dict.product.freeDelivery, dict.product.securePayment].map((perk, i) => (
              <li key={perk} className="flex items-center gap-4 py-3 text-small text-ink-2">
                <span className="label w-6">{String(i + 1).padStart(2, "0")}</span>
                {perk}
              </li>
            ))}
          </ul>
        </div>

        {/* Form panel */}
        <div className="lg:col-span-6 lg:col-start-7">
          <Card tone="surface" className="p-6 sm:p-8">
            <LoginForm locale={locale as Locale} dict={dict} />
          </Card>
        </div>
      </div>
    </main>
  );
}
