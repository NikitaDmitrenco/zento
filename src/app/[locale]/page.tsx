import Link from "next/link";
import { notFound } from "next/navigation";
import { isValidLocale, Locale } from "../../i18n/config";
import { getDictionary } from "../../i18n/get-dictionary";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { demoCategories } from "../../db/data/demo-data";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const dict = await getDictionary(locale as Locale);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white p-8 sm:p-14 md:p-20 shadow-xl fade-in-up">
        <div className="relative z-10 max-w-2xl space-y-6">
          <span className="inline-block px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold rounded-full uppercase tracking-wider">
            Zento Collection 2026
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {dict.home.heroTitle}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {dict.home.heroSubtitle}
          </p>
          <div className="pt-2 flex flex-wrap gap-4">
            <Link href={`/${locale}/catalog`}>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold">
                {dict.home.exploreCatalog} →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            {dict.home.categoriesTitle}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {dict.home.categoriesSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {demoCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${locale}/catalog?category=${cat.slug}`}
              className="group"
            >
              <Card hoverable className="p-4 text-center h-full flex flex-col justify-between">
                <div className="w-12 h-12 mx-auto bg-slate-100 rounded-xl flex items-center justify-center text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors mb-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {cat.name}
                  </h3>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

    </main>
  );
}
