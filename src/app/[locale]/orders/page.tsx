import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { isValidLocale, Locale } from "../../../i18n/config";
import { getDictionary } from "../../../i18n/get-dictionary";
import { getSession } from "../../../lib/auth/session";
import { getUserOrders } from "../../../services/orders/order-service";
import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};

  return {
    title: "Мои заказы | Zento",
  };
}

export default async function UserOrdersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const dict = await getDictionary(locale as Locale);
  const session = await getSession();

  if (!session) {
    redirect(`/${locale}/auth/login?callbackUrl=/${locale}/orders`);
  }

  const userOrders = await getUserOrders(session.userId, session.email);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="warning">В обработке (PENDING)</Badge>;
      case "CONFIRMED":
        return <Badge variant="success">Подтверждён (CONFIRMED)</Badge>;
      case "PROCESSING":
        return <Badge variant="default">Комплектуется (PROCESSING)</Badge>;
      case "SHIPPED":
        return <Badge variant="success">Отправлен (SHIPPED)</Badge>;
      case "COMPLETED":
        return <Badge variant="success">Доставлен (COMPLETED)</Badge>;
      case "CANCELLED":
        return <Badge variant="danger">Отменён (CANCELLED)</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            📦 Мои заказы ({userOrders.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            История оформленных заказов для аккаунта <strong className="text-slate-800">{session.email}</strong>
          </p>
        </div>

        <Link href={`/${locale}/catalog`}>
          <Button size="sm" variant="outline">
            {dict.cart.continueShopping}
          </Button>
        </Link>
      </div>

      {userOrders.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 space-y-4 my-8">
          <div className="w-16 h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center text-slate-400 text-2xl">
            📦
          </div>
          <h2 className="text-xl font-bold text-slate-900">У вас пока нет оформленных заказов</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Все ваши покупки и отслеживание их статусов будут отображаться на этой странице.
          </p>
          <Link href={`/${locale}/catalog`}>
            <Button size="md" className="bg-slate-900 text-white">
              {dict.cart.continueShopping} →
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {userOrders.map((order) => {
            const formattedTotal = (order.totalAmount / 100).toLocaleString(locale, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            });

            return (
              <Card key={order.id} className="p-6 space-y-6 border border-slate-200">
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {order.id}
                      </span>
                      {getStatusBadge(order.status)}
                    </div>
                    <p className="text-xs text-slate-400">
                      Дата оформления: {new Date(order.createdAt).toLocaleString(locale)}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-500 block">Итого к оплате</span>
                    <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                      {formattedTotal} {dict.common.currency}
                    </span>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Состав заказа</h4>
                  <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden bg-slate-50/50">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="p-3 flex justify-between items-center text-xs">
                        <div>
                          <span className="font-semibold text-slate-900 block">{item.productName}</span>
                          <span className="text-slate-500">{item.quantity} × {((item.unitPrice) / 100).toLocaleString(locale)} {dict.common.currency}</span>
                        </div>
                        <span className="font-bold text-slate-900">
                          {((item.totalAmount) / 100).toLocaleString(locale)} {dict.common.currency}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="pt-2 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex flex-col sm:flex-row justify-between gap-2">
                  <div>
                    <span className="font-semibold text-slate-800 block">Получатель: {order.customerName}</span>
                    <span>Телефон: {order.customerPhone}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800 block">Адрес доставки:</span>
                    <span>{order.shippingAddress}</span>
                  </div>
                </div>

              </Card>
            );
          })}
        </div>
      )}
    </main>
  );
}
