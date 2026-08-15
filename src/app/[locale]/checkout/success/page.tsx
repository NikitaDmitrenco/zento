import Link from "next/link";
import { notFound } from "next/navigation";
import { isValidLocale, Locale } from "../../../../i18n/config";
import { getDictionary } from "../../../../i18n/get-dictionary";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";

export default async function OrderSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ orderId?: string; paymentMethod?: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const query = await searchParams;
  const dict = await getDictionary(locale as Locale);
  const isPaidCard = query.paymentMethod === "CARD";

  return (
    <main className="max-w-2xl mx-auto px-4 py-16 text-center space-y-8">
      
      {/* Success Badge */}
      <div className="w-20 h-20 mx-auto bg-emerald-50 border-2 border-emerald-200 rounded-full flex items-center justify-center text-3xl shadow-sm animate-bounce">
        🎉
      </div>

      <div className="space-y-3">
        <div className="flex justify-center items-center gap-2">
          {isPaidCard ? (
            <Badge variant="success" className="px-3 py-1 text-xs">
              ✓ {dict.checkout.paidOnline} (3D-Secure)
            </Badge>
          ) : (
            <Badge variant="outline" className="px-3 py-1 text-xs bg-slate-100">
              💵 {dict.checkout.payOnDelivery}
            </Badge>
          )}
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {dict.checkout.successTitle}
        </h1>
        <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          {dict.checkout.successText}
        </p>
      </div>

      {/* Order Info Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs max-w-md mx-auto space-y-4 text-left text-xs">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <span className="text-slate-500 font-medium">Номер заказа:</span>
          <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">
            {query.orderId || "ORD-000000"}
          </span>
        </div>

        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <span className="text-slate-500 font-medium">Способ оплаты:</span>
          <span className="font-semibold text-slate-900 flex items-center gap-1.5">
            {isPaidCard ? "💳 Банковская карта (Оплачен)" : "💵 При получении (Курьеру)"}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-slate-500 font-medium">Статус заказа:</span>
          <span className={`font-bold ${isPaidCard ? "text-emerald-600" : "text-blue-600"}`}>
            {isPaidCard ? "✓ Оплачен и передан на сборку" : "Ожидает подтверждения менеджера"}
          </span>
        </div>
      </div>

      <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
        <Link href={`/${locale}/catalog`}>
          <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white font-semibold w-full sm:w-auto">
            {dict.cart.continueShopping} →
          </Button>
        </Link>
      </div>

    </main>
  );
}
