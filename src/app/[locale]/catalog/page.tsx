import Link from "next/link";
import { notFound } from "next/navigation";
import { isValidLocale, Locale } from "../../../i18n/config";
import { getDictionary } from "../../../i18n/get-dictionary";
import { searchCatalog } from "../../../services/search/search-service";
import { db } from "../../../db";
import { demoCategories, demoBrands } from "../../../db/seed";
import { ProductCard } from "../../../components/catalog/product-card";
import { CatalogFilters } from "../../../components/catalog/catalog-filters";
import { Button } from "../../../components/ui/button";

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
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-5 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {dict.catalog.title}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {dict.catalog.itemsFound}: <span className="font-semibold text-slate-800">{result.total}</span>
          </p>
        </div>
      </div>

      {/* Main Grid & Filters Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Filters */}
        <div className="lg:col-span-1">
          <CatalogFilters
            locale={locale as Locale}
            dict={dict}
            categories={categoriesList}
            brands={brandsList}
          />
        </div>

        {/* Catalog Products Grid */}
        <div className="lg:col-span-3 space-y-8">
          {result.items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {result.items.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  locale={locale as Locale}
                  dict={dict}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 space-y-4">
              <div className="w-16 h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                🔍
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                {dict.common.empty}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {dict.catalog.noProducts}
              </p>
              <Link href={`/${locale}/catalog`}>
                <Button variant="secondary" size="sm">
                  {dict.catalog.resetFilters}
                </Button>
              </Link>
            </div>
          )}

          {/* Pagination */}
          {result.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-6 border-t border-slate-200">
              {Array.from({ length: result.totalPages }, (_, i) => i + 1).map((p) => {
                const isActive = p === result.page;
                const newParams = new URLSearchParams(queryParams as any);
                newParams.set("page", p.toString());
                return (
                  <Link key={p} href={`/${locale}/catalog?${newParams.toString()}`}>
                    <Button
                      size="sm"
                      variant={isActive ? "primary" : "outline"}
                      className="w-9 h-9 p-0 text-xs"
                    >
                      {p}
                    </Button>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

      </div>

    </main>
  );
}
