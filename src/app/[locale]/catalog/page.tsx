import Link from "next/link";
import { notFound } from "next/navigation";
import { isValidLocale, Locale } from "../../../i18n/config";
import { getDictionary } from "../../../i18n/get-dictionary";
import { searchCatalog } from "../../../services/search/search-service";
import { db } from "../../../db";
import { demoCategories, demoBrands } from "../../../db/data/demo-data";
import { ProductCard } from "../../../components/catalog/product-card";
import { CatalogFilters } from "../../../components/catalog/catalog-filters";
import { Button } from "../../../components/ui/button";
import { SectionHead } from "../../../components/ui/section-head";
import { EmptyState } from "../../../components/ui/empty-state";

export default async function CatalogPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    query?: string;
    category?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    sortBy?: string;
    page?: string;
  }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const queryParams = await searchParams;
  const dict = await getDictionary(locale as Locale);

  // Fetch Categories & Brands for filters with offline fallback
  let categoriesList = [];
  let brandsList = [];
  try {
    categoriesList = await db.query.categories.findMany();
    brandsList = await db.query.brands.findMany();
  } catch {
    categoriesList = demoCategories.map((c, i) => ({ id: `cat-${i}`, name: c.name, slug: c.slug }));
    brandsList = demoBrands.map((b, i) => ({ id: `br-${i}`, name: b.name, slug: b.slug }));
  }

  // Sort brands by popularity order
  const brandOrder = ["apple", "samsung", "xiaomi", "sony", "asus", "google", "lenovo", "bose", "garmin", "anker"];
  brandsList.sort((a, b) => {
    const idxA = brandOrder.indexOf(a.slug);
    const idxB = brandOrder.indexOf(b.slug);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return a.name.localeCompare(b.name);
  });

  const currentPage = parseInt(queryParams.page || "1", 10);
  const result = await searchCatalog({
    query: queryParams.query,
    categorySlug: queryParams.category,
    brandSlug: queryParams.brand,
    sortBy: queryParams.sortBy as any,
    page: currentPage,
    limit: 9,
  });

  return (
    <main className="container-x pt-10 sm:pt-14 pb-8 space-y-10">
      {/* Page head */}
      <SectionHead
        as="h1"
        index="—"
        title={dict.catalog.title}
        aside={
          <p className="label">
            {dict.catalog.itemsFound}: <span className="text-ink">{String(result.total).padStart(2, "0")}</span>
          </p>
        }
      />

      {/* Filters + grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-10 items-start">
        <div className="lg:col-span-3">
          {/* Below lg the filters collapse behind a ruled disclosure row */}
          <details className="lg:hidden group border-y border-line">
            <summary className="flex items-center justify-between py-3.5 cursor-pointer list-none label text-ink [&::-webkit-details-marker]:hidden">
              {dict.catalog.filterBy}
              <span className="text-[15px] leading-none transition-transform duration-180 group-open:rotate-45" aria-hidden="true">+</span>
            </summary>
            <div className="pb-6">
              <CatalogFilters locale={locale as Locale} dict={dict} categories={categoriesList} brands={brandsList} />
            </div>
          </details>
          <div className="hidden lg:block">
            <CatalogFilters locale={locale as Locale} dict={dict} categories={categoriesList} brands={brandsList} />
          </div>
        </div>

        <div className="lg:col-span-9 space-y-8">
          {result.items.length > 0 ? (
            <div className="rule-grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
              {result.items.map((prod, i) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  locale={locale as Locale}
                  dict={dict}
                  index={(result.page - 1) * result.limit + i + 1}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              index="00"
              title={dict.common.empty}
              text={dict.catalog.noProducts}
              action={
                <Link href={`/${locale}/catalog`}>
                  <Button variant="outline" size="sm">
                    {dict.catalog.resetFilters}
                  </Button>
                </Link>
              }
            />
          )}

          {/* Pagination: a ruled row of mono page numbers */}
          {result.totalPages > 1 && (
            <nav className="flex items-center justify-between pt-5 border-t border-line" aria-label="Pagination">
              <span className="label">
                {String(result.page).padStart(2, "0")} / {String(result.totalPages).padStart(2, "0")}
              </span>
              <div className="flex items-center gap-1">
                {Array.from({ length: result.totalPages }, (_, i) => i + 1).map((p) => {
                  const isActive = p === result.page;
                  const newParams = new URLSearchParams(queryParams as any);
                  newParams.set("page", p.toString());
                  return (
                    <Link
                      key={p}
                      href={`/${locale}/catalog?${newParams.toString()}`}
                      aria-current={isActive ? "page" : undefined}
                      className={`data inline-flex items-center justify-center w-9 h-9 rounded-sm text-[13px] transition-colors duration-180 ${
                        isActive
                          ? "bg-ink text-ink-inverse"
                          : "text-ink-2 hover:bg-surface hover:text-ink border border-transparent hover:border-line"
                      }`}
                    >
                      {String(p).padStart(2, "0")}
                    </Link>
                  );
                })}
              </div>
            </nav>
          )}
        </div>
      </div>
    </main>
  );
}
