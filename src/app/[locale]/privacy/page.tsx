import { notFound } from "next/navigation";
import { isValidLocale, Locale } from "../../../i18n/config";
import { getDictionary } from "../../../i18n/get-dictionary";
import { Badge } from "../../../components/ui/badge";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = await getDictionary(locale);

  return {
    title: `${dict.footer.privacy} | Zento Moldova`,
    description: "Политика конфиденциальности и защиты персональных данных Zento в соответствии с законодательством Республики Молдова",
  };
}

const sections = [
  { id: "s1", index: "01", title: "1. Нормативно-правовая база Республики Молдова" },
  { id: "s2", index: "02", title: "2. Категории собираемых персональных данных" },
  { id: "s3", index: "03", title: "3. Безопасность, Хранение и Утилизация данных (Закон от 23 августа)" },
  { id: "s4", index: "04", title: "4. Права субъекта персональных данных" },
  { id: "s5", index: "05", title: "5. Контакты оператора персональных данных" },
];

function SectionTitle({ index, title }: { index: string; title: string }) {
  return (
    <div className="flex items-baseline gap-4">
      <span className="label pt-1 min-w-8">{index}</span>
      <h2 className="text-h3 text-ink">{title}</h2>
    </div>
  );
}

export default async function PrivacyPage({
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
          <Badge variant="outline">Законодательство Республики Молдова</Badge>
          <span className="data">Обновлено: 15 августа 2026 г.</span>
        </div>
        <h1 className="text-h1 text-ink">Политика конфиденциальности</h1>
        <p className="text-body text-ink-2 max-w-prose">
          Положение об обработке, защите, хранении и безопасной утилизации персональных данных клиентов интернет-магазина Zento в Республике Молдова.
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
                Настоящая Политика конфиденциальности разработана в строгом соответствии с законодательством Республики Молдова, включая:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-ink font-medium">Закон РМ № 133 от 08.07.2011 г.</strong> «О защите персональных данных» (Legea privind protecţia datelor cu caracter personal);</li>
                <li><strong className="text-ink font-medium">Закон РМ № 284 от 22.07.2004 г.</strong> «Об электронной коммерции»;</li>
                <li>Регламенты <strong className="text-ink font-medium">Национального центра по защите персональных данных (CNPDCP)</strong> Республики Молдова;</li>
                <li>Законодательные стандарты РМ в редакции, вступающей в силу <strong className="text-ink font-medium">23 августа 2026 г.</strong>, регулирующие строгие правила сбора, шифрования, локализации хранения и сертифицированной утилизации цифрой информации.</li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section id="s2" className="border-t border-line pt-8 space-y-5 scroll-mt-24">
            <SectionTitle index={sections[1].index} title={sections[1].title} />
            <div className="text-body text-ink-2 max-w-prose space-y-4">
              <p>
                Для оформления и доставки заказов цифровой техники Zento производит сбор следующих минимально необходимых персональных данных:
              </p>
            </div>
            <div className="rule-grid grid-cols-1 sm:grid-cols-2">
              <div className="p-4 space-y-1.5">
                <span className="label block text-ink">Идентификация личности</span>
                <span className="text-small text-ink-2 block">Фамилия, Имя, Отчество клиентов</span>
              </div>
              <div className="p-4 space-y-1.5">
                <span className="label block text-ink">Контактные данные</span>
                <span className="text-small text-ink-2 block">Номер телефона (+373), адрес электронной почты</span>
              </div>
              <div className="p-4 space-y-1.5">
                <span className="label block text-ink">Доставка</span>
                <span className="text-small text-ink-2 block">Точный адрес доставки на территории РМ</span>
              </div>
              <div className="p-4 space-y-1.5">
                <span className="label block text-ink">Технические метаданные</span>
                <span className="text-small text-ink-2 block">IP-адрес, файлы cookies сессии, тип браузера</span>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section id="s3" className="border-t border-line pt-8 space-y-5 scroll-mt-24">
            <SectionTitle index={sections[2].index} title={sections[2].title} />
            <div className="text-body text-ink-2 max-w-prose space-y-4">
              <p>
                В соответствии с новым законодательным регламентом РМ о защите информации, действующим с 23 августа 2026 года:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-ink font-medium">Локализация и шифрование:</strong> Все персональные данные хранятся в защищённой базе данных PostgreSQL с применением AES-256 шифрования в покое и SSL/TLS при передаче.</li>
                <li><strong className="text-ink font-medium">Срок хранения:</strong> Данные заказов хранятся в течение срока, установленного налоговым законодательством РМ (5 лет), после чего подлежат авто-архивации.</li>
                <li><strong className="text-ink font-medium">Сертифицированный регламент утилизации:</strong> По истечении нормативного срока хранения или по первому требованию покупателя данные подвергаются необратимому программному удалению (Crypto-shredding / DOD 5220.22-M) из всех активных и резервных копий систем.</li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section id="s4" className="border-t border-line pt-8 space-y-5 scroll-mt-24">
            <SectionTitle index={sections[3].index} title={sections[3].title} />
            <div className="text-body text-ink-2 max-w-prose space-y-4">
              <p>
                Каждый субъект данных в Республике Молдова обладает следующими законными правами:
              </p>
            </div>
            <div className="rule-grid grid-cols-1">
              <div className="p-4 text-small text-ink-2">
                <strong className="text-ink font-medium">Право на доступ и информацию:</strong> Получение подтверждения о факте обработки данных и выписки сведений.
              </div>
              <div className="p-4 text-small text-ink-2">
                <strong className="text-ink font-medium">Право на исправление и забор согласия:</strong> Требование изменения неточных данных или отзыв согласия.
              </div>
              <div className="p-4 text-small text-ink-2">
                <strong className="text-ink font-medium">Право на забор и забвение (Утилизацию):</strong> Требование полного уничтожения персональных записей в системах.
              </div>
            </div>
            <p className="text-small text-ink-3 max-w-prose">
              Пользователь имеет право подать жалобу в Национальный центр по защите персональных данных Республики Молдова (CNPDCP, mun. Chișinău, str. Serghei Lazo, 48).
            </p>
          </section>

          {/* Section 5 */}
          <section id="s5" className="border-t border-line pt-8 space-y-5 scroll-mt-24">
            <SectionTitle index={sections[4].index} title={sections[4].title} />
            <div className="text-body text-ink-2 max-w-prose space-y-4">
              <p>
                По вопросам обработки или отзыва согласия на обработку персональных данных обращайтесь в службу поддержки Zento:
              </p>
            </div>
            <div className="data text-small border-l-2 border-ink pl-4 space-y-1 text-ink">
              <p><strong className="font-medium">Оператор:</strong> Zento Tech SRL</p>
              <p><strong className="font-medium">Адрес:</strong> mun. Chișinău, Bd. Ștefan cel Mare și Sfânt, 1</p>
              <p><strong className="font-medium">Email:</strong> privacy@zento.tech / support@zento.tech</p>
              <p><strong className="font-medium">Телефон:</strong> +373 22 123456</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
