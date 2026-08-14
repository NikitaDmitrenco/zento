import Link from "next/link";
import { notFound } from "next/navigation";
import { isValidLocale, Locale } from "../../../../i18n/config";
import { getDictionary } from "../../../../i18n/get-dictionary";
import { Button } from "../../../../components/ui/button";

export default async function OrderSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const query = await searchParams;
  const dict = await getDictionary(locale as Locale);

  return (
    <main className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
      
      <div className="w-20 h-20 mx-auto bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center text-3xl shadow-xs">
        🎉
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {dict.checkout.successTitle}
        </h1>
        <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          {dict.checkout.successText}
        </p>
      </div>

      {query.orderId && (
        <div className="inline-block px-4 py-2 bg-slate-100 rounded-lg text-xs font-mono text-slate-800 border border-slate-200">
          ID заказа: <span className="font-bold">{query.orderId}</span>
        </div>
      )}

      <div className="pt-6">
        <Link href={`/${locale}/catalog`}>
          <Button size="lg" className="bg-slate-900 text-white font-semibold">
            {dict.cart.continueShopping} →
          </Button>
        </Link>
      </div>

    </main>
  );
}
