import Link from "next/link";
import { notFound } from "next/navigation";
import { isValidLocale, Locale } from "../../i18n/config";
import { getDictionary } from "../../i18n/get-dictionary";
import { searchCatalog } from "../../services/search/search-service";
import { ProductCard } from "../../components/catalog/product-card";
import { SectionHead } from "../../components/ui/section-head";
import { Price } from "../../components/ui/price";
import { Badge } from "../../components/ui/badge";
import { CategoryIcon } from "../../components/ui/category-icon";
import { demoCategories } from "../../db/data/demo-data";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const dict = await getDictionary(locale as Locale);
  const featured = await searchCatalog({ sortBy: "featured", limit: 5 });
  const [hero, ...rest] = featured.items;
  const grid = rest.slice(0, 4);

  return (
    <main className="container-x">
      {/* Hero: headline column + one product plate. Asymmetric, no box. */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-10 pt-12 sm:pt-16 pb-14 sm:pb-20">
        <div className="lg:col-span-7 flex flex-col justify-between reveal">
          <div>
            <p className="label mb-6">N° 01 — Zento Collection 2026</p>
            <h1 className="text-[clamp(1.9rem,4.6vw,3.5rem)] leading-[1.05] tracking-[-0.035em] text-ink [overflow-wrap:anywhere]">{dict.home.heroTitle}</h1>
          </div>
          <div className="mt-10 lg:mt-16 grid sm:grid-cols-12 gap-6 items-end">
            <p className="sm:col-span-7 text-[17px] leading-relaxed text-ink-2 max-w-md">
              {dict.home.heroSubtitle}
            </p>
            <div className="sm:col-span-5 sm:justify-self-end">
              <Link
                href={`/${locale}/catalog`}
                className="group inline-flex items-center gap-3 h-13 px-7 rounded-sm bg-ink text-ink-inverse text-[15px] font-medium hover:bg-signal transition-colors duration-180"
              >
                {dict.home.exploreCatalog}
                <span className="arrow" aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>

        {hero && (
          <Link
            href={`/${locale}/product/${hero.slug}`}
            className="group lg:col-span-5 block reveal reveal-delay"
            aria-label={hero.name}
          >
            <div className="plate aspect-[4/3] lg:aspect-[5/4] rounded-md relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={hero.primaryImage}
                alt=""
                className="w-full h-full object-cover transition-transform duration-700 ease-[var(--ease-out-quart)] group-hover:scale-[1.03]"
              />
              <div className="absolute top-3 left-3 flex gap-1.5">
                <Badge variant="signal">Top</Badge>
                <Badge variant="outline">{hero.category.name}</Badge>
              </div>
            </div>
            <div className="mt-4 flex items-start justify-between gap-4 border-t border-line-strong pt-3">
              <div className="min-w-0">
                <span className="label">{hero.brand.name}</span>
                <p className="text-[15px] font-medium text-ink mt-1 truncate group-hover:underline underline-offset-4 decoration-1">
                  {hero.name}
                </p>
              </div>
              <Price amount={hero.price} currency={dict.common.currency} locale={locale} size="md" className="shrink-0" />
            </div>
          </Link>
        )}
      </section>

      {/* Categories: one ruled row, not six floating cards */}
      <section className="space-y-8">
        <SectionHead index="02" title={dict.home.categoriesTitle} subtitle={dict.home.categoriesSubtitle} />
        <div className="rule-grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          {demoCategories.map((cat, i) => (
            <Link
              key={cat.slug}
              href={`/${locale}/catalog?category=${cat.slug}`}
              className="group relative flex flex-col justify-between aspect-[4/3] sm:aspect-square p-4 hover:bg-surface transition-colors duration-180"
            >
              <div className="flex items-start justify-between">
                <span className="label">{String(i + 1).padStart(2, "0")}</span>
                <span className="arrow text-ink-3 group-hover:text-ink" aria-hidden="true">→</span>
              </div>
              <CategoryIcon
                slug={cat.slug}
                className="w-9 h-9 text-ink-2 group-hover:text-signal transition-colors duration-180"
              />
              <h3 className="text-[15px] font-medium text-ink">{cat.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      {grid.length > 0 && (
        <section className="space-y-8 mt-20">
          <SectionHead
            index="03"
            title={dict.home.featuredTitle}
            subtitle={dict.home.featuredSubtitle}
            aside={
              <Link href={`/${locale}/catalog`} className="group inline-flex items-center gap-2 text-sm font-medium text-ink">
                {dict.home.exploreCatalog}
                <span className="arrow" aria-hidden="true">→</span>
              </Link>
            }
          />
          <div className="rule-grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {grid.map((p, i) => (
              <ProductCard key={p.id} product={p} locale={locale} dict={dict} index={i + 1} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
