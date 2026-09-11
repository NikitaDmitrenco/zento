"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Locale } from "../../i18n/config";
import { Dictionary } from "../../i18n/get-dictionary";
import { Button } from "../ui/button";
import { CategoryIcon } from "../ui/category-icon";

/** A filter row: a signal marker slides in when active. */
function FilterRow({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`group w-full flex items-center gap-2.5 text-left text-[13px] py-1.5 cursor-pointer transition-colors duration-180 ${
        active ? "text-ink font-medium" : "text-ink-2 hover:text-ink"
      }`}
    >
      <span
        aria-hidden="true"
        className={`w-1.5 h-1.5 shrink-0 transition-[background-color,transform] duration-180 ${
          active ? "bg-signal scale-100" : "bg-line scale-75 group-hover:bg-ink-3"
        }`}
      />
      {children}
    </button>
  );
}

export function CatalogFilters({
  locale,
  dict,
  categories,
  brands,
}: {
  locale: Locale;
  dict: Dictionary;
  categories: { id: string; name: string; slug: string }[];
  brands: { id: string; name: string; slug: string }[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("query") || "";
  const currentCat = searchParams.get("category") || "";
  const currentBrand = searchParams.get("brand") || "";
  const currentSort = searchParams.get("sortBy") || "featured";

  const [query, setQuery] = useState(currentSearch);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1"); // Reset to page 1 on filter change
    router.push(`/${locale}/catalog?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParam("query", query);
  };

  const handleReset = () => {
    setQuery("");
    router.push(`/${locale}/catalog`);
  };

  const hasFilters = currentSearch || currentCat || currentBrand || currentSort !== "featured";

  return (
    <aside className="space-y-7 lg:sticky lg:top-24">
      {/* Search */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <input
          type="search"
          placeholder={dict.common.searchPlaceholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="field pr-11"
          aria-label={dict.common.searchPlaceholder}
        />
        <button
          type="submit"
          className="absolute right-1 top-1 bottom-1 w-9 inline-flex items-center justify-center rounded-xs text-ink-2 hover:bg-ink hover:text-ink-inverse transition-colors duration-180 cursor-pointer"
          aria-label={dict.common.searchPlaceholder}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="6.5" />
            <path strokeLinecap="round" d="M16 16l4.5 4.5" />
          </svg>
        </button>
      </form>

      {/* Sorting */}
      <div className="pt-5 border-t border-line">
        <label htmlFor="catalog-sort" className="label block mb-2.5">
          {dict.catalog.sortBy}
        </label>
        <select
          id="catalog-sort"
          value={currentSort}
          onChange={(e) => updateParam("sortBy", e.target.value)}
          className="field h-10"
        >
          <option value="featured">{dict.catalog.sortPopularity}</option>
          <option value="price_asc">{dict.catalog.sortPriceAsc}</option>
          <option value="price_desc">{dict.catalog.sortPriceDesc}</option>
          <option value="name_asc">{dict.catalog.sortName}</option>
        </select>
      </div>

      {/* Categories */}
      <div className="pt-5 border-t border-line">
        <p className="label mb-2.5">{dict.home.categoriesTitle}</p>
        <div className="max-h-56 overflow-y-auto pr-1">
          <FilterRow active={!currentCat} onClick={() => updateParam("category", "")}>
            {dict.common.allCategories}
          </FilterRow>
          {categories.map((cat) => (
            <FilterRow key={cat.id} active={currentCat === cat.slug} onClick={() => updateParam("category", cat.slug)}>
              <CategoryIcon slug={cat.slug} className="w-3.5 h-3.5 shrink-0 text-ink-3" />
              <span>{cat.name}</span>
            </FilterRow>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div className="pt-5 border-t border-line">
        <p className="label mb-2.5">Бренды</p>
        <div className="max-h-64 overflow-y-auto pr-1">
          <FilterRow active={!currentBrand} onClick={() => updateParam("brand", "")}>
            Все бренды
          </FilterRow>
          {brands.map((br) => (
            <FilterRow key={br.id} active={currentBrand === br.slug} onClick={() => updateParam("brand", br.slug)}>
              {br.name}
            </FilterRow>
          ))}
        </div>
      </div>

      {/* Reset */}
      {hasFilters && (
        <div className="pt-5 border-t border-line">
          <Button onClick={handleReset} variant="outline" size="sm" className="w-full">
            {dict.catalog.resetFilters}
          </Button>
        </div>
      )}
    </aside>
  );
}
