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
  const orderId = query.orderId || "ORD-000000";

  return (
    <main className="container-x pt-14 sm:pt-20 pb-16">
      <div className="max-w-xl mx-auto space-y-8 reveal">

        {/* Meta line + payment badge */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="label">N° {orderId}</p>
          {isPaidCard ? (
            <Badge variant="success">✓ {dict.checkout.paidOnline} (3D-Secure)</Badge>
          ) : (
            <Badge variant="outline">{dict.checkout.payOnDelivery}</Badge>
          )}
        </div>

        <div className="space-y-4">
          <h1 className="text-h1 text-ink">{dict.checkout.successTitle}</h1>
          <p className="text-body text-ink-2 max-w-md">{dict.checkout.successText}</p>
        </div>

        {/* Order Info */}
        <dl className="border-t border-line-strong divide-y divide-line">
          <div className="grid grid-cols-12 gap-x-4 py-3.5 text-small">
            <dt className="col-span-5 sm:col-span-4 text-ink-3">Номер заказа:</dt>
            <dd className="col-span-7 sm:col-span-8 data text-ink font-medium">{orderId}</dd>
          </div>

          <div className="grid grid-cols-12 gap-x-4 py-3.5 text-small">
            <dt className="col-span-5 sm:col-span-4 text-ink-3">Способ оплаты:</dt>
            <dd className="col-span-7 sm:col-span-8 text-ink font-medium">
              {isPaidCard ? "Банковская карта (Оплачен)" : "При получении (Курьеру)"}
            </dd>
          </div>

          <div className="grid grid-cols-12 gap-x-4 py-3.5 text-small">
            <dt className="col-span-5 sm:col-span-4 text-ink-3">Статус заказа:</dt>
            <dd className={`col-span-7 sm:col-span-8 font-medium ${isPaidCard ? "text-ok" : "text-ink-2"}`}>
              {isPaidCard ? "✓ Оплачен и передан на сборку" : "Ожидает подтверждения менеджера"}
            </dd>
          </div>
        </dl>

        <div className="pt-2">
          <Link href={`/${locale}/catalog`} className="inline-block w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto">
              {dict.cart.continueShopping}
              <span className="arrow" aria-hidden="true">→</span>
            </Button>
          </Link>
        </div>

      </div>
    </main>
  );
}
