"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Locale } from "../../i18n/config";
import { Dictionary } from "../../i18n/get-dictionary";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

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

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-6">
      
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <Input
          type="text"
          placeholder={dict.common.searchPlaceholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button type="submit" variant="primary" size="md">
          🔍
        </Button>
      </form>

      {/* Sorting */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
          {dict.catalog.sortBy}
        </label>
        <select
          value={currentSort}
          onChange={(e) => updateParam("sortBy", e.target.value)}
          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
        >
          <option value="featured">{dict.catalog.sortPopularity}</option>
          <option value="price_asc">{dict.catalog.sortPriceAsc}</option>
          <option value="price_desc">{dict.catalog.sortPriceDesc}</option>
          <option value="name_asc">{dict.catalog.sortName}</option>
        </select>
      </div>

      {/* Categories */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
          {dict.home.categoriesTitle}
        </label>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          <button
            onClick={() => updateParam("category", "")}
            className={`w-full text-left text-xs font-medium px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              !currentCat ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            {dict.common.allCategories}
          </button>
          {categories.map((cat) => {
            const isActive = currentCat === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => updateParam("category", cat.slug)}
                className={`w-full text-left text-xs font-medium px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  isActive ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Brands */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
          Бренды
        </label>
        <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
          <button
            onClick={() => updateParam("brand", "")}
            className={`w-full text-left text-xs font-medium px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              !currentBrand ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            Все бренды
          </button>
          {brands.map((br) => {
            const isActive = currentBrand === br.slug;
            return (
              <button
                key={br.id}
                onClick={() => updateParam("brand", br.slug)}
                className={`w-full text-left text-xs font-medium px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  isActive ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {br.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Reset Filters */}
      {(currentSearch || currentCat || currentBrand || currentSort !== "featured") && (
        <Button onClick={handleReset} variant="outline" size="sm" className="w-full text-xs">
          {dict.catalog.resetFilters}
        </Button>
      )}
    </div>
  );
}
