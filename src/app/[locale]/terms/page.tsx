import { notFound } from "next/navigation";
import { isValidLocale, Locale } from "../../../i18n/config";
import { getDictionary } from "../../../i18n/get-dictionary";
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

const sections = [
  { id: "s1", index: "01", title: "1. Общие положения" },
  { id: "s2", index: "02", title: "2. Цены и Оплата в Молдавских Леях (MDL)" },
  { id: "s3", index: "03", title: "3. Право на возврат товара в течение 14 дней" },
  { id: "s4", index: "04", title: "4. Гарантийные обязательства" },
  { id: "s5", index: "05", title: "5. Доставка по Республике Молдова" },
];

function SectionTitle({ index, title }: { index: string; title: string }) {
  return (
    <div className="flex items-baseline gap-4">
      <span className="label pt-1 min-w-8">{index}</span>
      <h2 className="text-h3 text-ink">{title}</h2>
    </div>
  );
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
    <main className="container-x pt-10 sm:pt-14 pb-8 space-y-10">
      {/* Header */}
      <header className="border-b border-line-strong pb-8 space-y-4">
        <div className="label flex flex-wrap items-center gap-3">
          <Badge variant="outline">Закон РМ № 105/2003 о защите прав потребителей</Badge>
          <span className="data">Версия: 2026 г.</span>
        </div>
        <h1 className="text-h1 text-ink">Условия обслуживания</h1>
        <p className="text-body text-ink-2 max-w-prose">
          Правила покупки, гарантийные обязательства, условия доставки и возврата товаров цифровой техники Zento в Республике Молдова.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-10 items-start">
        {/* Table of contents */}
        <nav className="lg:col-span-3 lg:sticky lg:top-24">
          <ol className="border-t border-line divide-y divide-line">
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="group flex items-baseline gap-3 py-2.5 text-small text-ink-2 hover:text-ink transition-colors">
                  <span className="label w-6 shrink-0">{s.index}</span>
                  <span>{s.title}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* Document */}
        <div className="lg:col-span-9 space-y-12">
          {/* Section 1 */}
          <section id="s1" className="border-t border-line pt-8 space-y-5 scroll-mt-24">
            <SectionTitle index={sections[0].index} title={sections[0].title} />
            <div className="text-body text-ink-2 max-w-prose space-y-4">
              <p>
                Настоящее Пользовательское соглашение регулирует порядок взаимоотношений между покупателями и интернет-магазином <strong className="text-ink font-medium">Zento Tech SRL</strong> на территории Республики Молдова в соответствии со следующими актами:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-ink font-medium">Закон РМ № 105 от 13.03.2003 г.</strong> «О защите прав потребителей» (Legea privind protecţia consumatorilor);</li>
                <li><strong className="text-ink font-medium">Закон РМ № 284 от 22.07.2004 г.</strong> «Об электронной коммерции»;</li>
                <li>Гражданский кодекс Республики Молдова № 1107/2002.</li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section id="s2" className="border-t border-line pt-8 space-y-5 scroll-mt-24">
            <SectionTitle index={sections[1].index} title={sections[1].title} />
            <div className="text-body text-ink-2 max-w-prose space-y-4">
              <p>
                Все цены на товары на сайте Zento указаны в молдавских леях (MDL) с учётом НДС. Оплата производится наличными или банковской картой при получении заказа.
              </p>
            </div>
            <div className="rule-grid grid-cols-1 max-w-prose">
              <div className="p-4 text-small text-ink-2">
                Официальный чек выдается курьером в момент передачи товара клиента.
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section id="s3" className="border-t border-line pt-8 space-y-5 scroll-mt-24">
            <SectionTitle index={sections[2].index} title={sections[2].title} />
            <div className="text-body text-ink-2 max-w-prose space-y-4">
              <p>
                В соответствии со ст. 19 Закона РМ № 105/2003, покупатель имеет право вернуть или обменять качественную цифровую технику надлежащего качества в течение <strong className="text-ink font-medium">14 календарных дней</strong> со дня покупки при соблюдении следующих условий:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Сохранён первоначальный товарный вид, заводские пломбы и оригинальная упаковка;</li>
                <li>Товар не был в активной эксплуатации и не содержат следов установки/активации;</li>
                <li>Имеется в наличии кассовый чек или документ, подтверждающий факт покупки.</li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section id="s4" className="border-t border-line pt-8 space-y-5 scroll-mt-24">
            <SectionTitle index={sections[3].index} title={sections[3].title} />
            <div className="text-body text-ink-2 max-w-prose space-y-4">
              <p>
                На всю сложную цифровую технику Zento предоставляется официальная заводская гарантия сроком от 12 до 24 месяцев. В случае возникновения гарантийного случая клиент имеет право на бесплатный ремонт в авторизованных сервисных центрах Кишинева или замену товара.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section id="s5" className="border-t border-line pt-8 space-y-5 scroll-mt-24">
            <SectionTitle index={sections[4].index} title={sections[4].title} />
            <div className="text-body text-ink-2 max-w-prose space-y-4">
              <p>
                Доставка курьером по г. Кишинев и районам Республики Молдова осуществляется в течение 24–48 часов после подтверждения заказа. При сумме заказа от 1000 MDL доставка осуществляется бесплатно.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
