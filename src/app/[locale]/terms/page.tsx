import Link from "next/link";
import { notFound } from "next/navigation";
import { isValidLocale, Locale } from "../../../i18n/config";
import { getDictionary } from "../../../i18n/get-dictionary";
import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = await getDictionary(locale);

  return {
    title: `${dict.footer.terms} | Zento Moldova`,
    description: "Условия обслуживания и правила покупки в интернет-магазине Zento на территории Республики Молдова",
  };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const dict = await getDictionary(locale as Locale);

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="success">Закон РМ № 105/2003 о защите прав потребителей</Badge>
          <span className="text-xs text-slate-400 font-mono">Версия: 2026 г.</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Условия обслуживания
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Правила покупки, гарантийные обязательства, условия доставки и возврата товаров цифровой техники Zento в Республике Молдова.
        </p>
      </div>

      <div className="space-y-8 text-sm text-slate-700 leading-relaxed">
        
        {/* Section 1 */}
        <section className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>📜</span> 1. Общие положения
          </h2>
          <p>
            Настоящее Пользовательское соглашение регулирует порядок взаимоотношений между покупателями и интернет-магазином <strong>Zento Tech SRL</strong> на территории Республики Молдова в соответствии со следующими актами:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-600 pl-2">
            <li><strong>Закон РМ № 105 от 13.03.2003 г.</strong> «О защите прав потребителей» (Legea privind protecţia consumatorilor);</li>
            <li><strong>Закон РМ № 284 от 22.07.2004 г.</strong> «Об электронной коммерции»;</li>
            <li>Гражданский кодекс Республики Молдова № 1107/2002.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>🏷️</span> 2. Цены и Оплата в Молдавских Леях (MDL)
          </h2>
          <p>
            Все цены на товары на сайте Zento указаны в молдавских леях (MDL) с учётом НДС. Оплата производится наличными или банковской картой при получении заказа.
          </p>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
            Официальный чек выдается курьером в момент передачи товара клиента.
          </div>
        </section>

        {/* Section 3 */}
        <section className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>🔄</span> 3. Право на возврат товара в течение 14 дней
          </h2>
          <p>
            В соответствии со ст. 19 Закона РМ № 105/2003, покупатель имеет право вернуть или обменять качественную цифровую технику надлежащего качества в течение <strong>14 календарных дней</strong> со дня покупки при соблюдении следующих условий:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-600 pl-2">
            <li>Сохранён первоначальный товарный вид, заводские пломбы и оригинальная упаковка;</li>
            <li>Товар не был в активной эксплуатации и не содержат следов установки/активации;</li>
            <li>Имеется в наличии кассовый чек или документ, подтверждающий факт покупки.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>🛡️</span> 4. Гарантийные обязательства
          </h2>
          <p>
            На всю сложную цифровую технику Zento предоставляется официальная заводская гарантия сроком от 12 до 24 месяцев. В случае возникновения гарантийного случая клиент имеет право на бесплатный ремонт в авторизованных сервисных центрах Кишинева или замену товара.
          </p>
        </section>

        {/* Section 5 */}
        <section className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>🚚</span> 5. Доставка по Республике Молдова
          </h2>
          <p>
            Доставка курьером по г. Кишинев и районам Республики Молдова осуществляется в течение 24–48 часов после подтверждения заказа. При сумме заказа от 1000 MDL доставка осуществляется бесплатно.
          </p>
        </section>

      </div>

    </main>
  );
}
