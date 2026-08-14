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
    title: `${dict.footer.privacy} | Zento Moldova`,
    description: "Политика конфиденциальности и защиты персональных данных Zento в соответствии с законодательством Республики Молдова",
  };
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
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="success">Законодательство Республики Молдова</Badge>
          <span className="text-xs text-slate-400 font-mono">Обновлено: 15 августа 2026 г.</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Политика конфиденциальности
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Положение об обработке, защите, хранении и безопасной утилизации персональных данных клиентов интернет-магазина Zento в Республике Молдова.
        </p>
      </div>

      <div className="space-y-8 text-sm text-slate-700 leading-relaxed">
        
        {/* Section 1 */}
        <section className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>⚖️</span> 1. Нормативно-правовая база Республики Молдова
          </h2>
          <p>
            Настоящая Политика конфиденциальности разработана в строгом соответствии с законодательством Республики Молдова, включая:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-600 pl-2">
            <li><strong>Закон РМ № 133 от 08.07.2011 г.</strong> «О защите персональных данных» (Legea privind protecţia datelor cu caracter personal);</li>
            <li><strong>Закон РМ № 284 от 22.07.2004 г.</strong> «Об электронной коммерции»;</li>
            <li>Регламенты <strong>Национального центра по защите персональных данных (CNPDCP)</strong> Республики Молдова;</li>
            <li>Законодательные стандарты РМ в редакции, вступающей в силу <strong>23 августа 2026 г.</strong>, регулирующие строгие правила сбора, шифрования, локализации хранения и сертифицированной утилизации цифрой информации.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>📋</span> 2. Категории собираемых персональных данных
          </h2>
          <p>
            Для оформления и доставки заказов цифровой техники Zento производит сбор следующих минимально необходимых персональных данных:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="font-bold text-slate-900 block text-xs">Идентификация личности</span>
              <span className="text-xs text-slate-500">Фамилия, Имя, Отчество клиентов</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="font-bold text-slate-900 block text-xs">Контактные данные</span>
              <span className="text-xs text-slate-500">Номер телефона (+373), адрес электронной почты</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="font-bold text-slate-900 block text-xs">Доставка</span>
              <span className="text-xs text-slate-500">Точный адрес доставки на территории РМ</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="font-bold text-slate-900 block text-xs">Технические метаданные</span>
              <span className="text-xs text-slate-500">IP-адрес, файлы cookies сессии, тип браузера</span>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>🔒</span> 3. Безопасность, Хранение и Утилизация данных (Закон от 23 августа)
          </h2>
          <p>
            В соответствии с новым законодательным регламентом РМ о защите информации, действующим с 23 августа 2026 года:
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-600 pl-2">
            <li><strong>Локализация и шифрование:</strong> Все персональные данные хранятся в защищённой базе данных PostgreSQL с применением AES-256 шифрования в покое и SSL/TLS при передаче.</li>
            <li><strong>Срок хранения:</strong> Данные заказов хранятся в течение срока, установленного налоговым законодательством РМ (5 лет), после чего подлежат авто-архивации.</li>
            <li><strong>Сертифицированный регламент утилизации:</strong> По истечении нормативного срока хранения или по первому требованию покупателя данные подвергаются необратимому программному удалению (Crypto-shredding / DOD 5220.22-M) из всех активных и резервных копий систем.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>🛡️</span> 4. Права субъекта персональных данных
          </h2>
          <p>
            Каждый субъект данных в Республике Молдова обладает следующими законными правами:
          </p>
          <div className="space-y-2">
            <div className="p-3 bg-slate-50 rounded-xl">
              <strong className="text-slate-900">Право на доступ и информацию:</strong> Получение подтверждения о факте обработки данных и выписки сведений.
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <strong className="text-slate-900">Право на исправление и забор согласия:</strong> Требование изменения неточных данных или отзыв согласия.
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <strong className="text-slate-900">Право на забор и забвение (Утилизацию):</strong> Требование полного уничтожения персональных записей в системах.
            </div>
          </div>
          <p className="text-xs text-slate-500 pt-2">
            Пользователь имеет право подать жалобу в Национальный центр по защите персональных данных Республики Молдова (CNPDCP, mun. Chișinău, str. Serghei Lazo, 48).
          </p>
        </section>

        {/* Section 5 */}
        <section className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>📞</span> 5. Контакты оператора персональных данных
          </h2>
          <p>
            По вопросам обработки или отзыва согласия на обработку персональных данных обращайтесь в службу поддержки Zento:
          </p>
          <div className="text-xs font-mono bg-slate-50 p-4 rounded-xl space-y-1 text-slate-800 border border-slate-200">
            <p><strong>Оператор:</strong> Zento Tech SRL</p>
            <p><strong>Адрес:</strong> mun. Chișinău, Bd. Ștefan cel Mare și Sfânt, 1</p>
            <p><strong>Email:</strong> privacy@zento.tech / support@zento.tech</p>
            <p><strong>Телефон:</strong> +373 22 123456</p>
          </div>
        </section>

      </div>

    </main>
  );
}
