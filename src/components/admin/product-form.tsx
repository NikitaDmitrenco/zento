"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Alert } from "../ui/alert";
import { SectionHead } from "../ui/section-head";

export function ProductForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [brandSlug, setBrandSlug] = useState("zentotech");
  const [categorySlug, setCategorySlug] = useState("smartphones");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("10");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!slug || slug === name.toLowerCase().replace(/[^a-z0-9]+/g, "-")) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/products/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug,
          brandSlug,
          categorySlug,
          price: Number(price),
          stock: Number(stock),
          description,
          imageUrl,
          isFeatured,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Ошибка при создании товара");
        setLoading(false);
        return;
      }

      setSuccessMsg("Товар успешно добавлен в каталог!");
      setTimeout(() => {
        router.push("/admin/products");
        router.refresh();
      }, 1000);
    } catch {
      setErrorMsg("Произошла ошибка при отправке формы.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10 max-w-3xl">
      <SectionHead
        as="h1"
        index="—"
        title="Добавление нового товара"
        subtitle="Заполните данные карточки товара для публикации в каталоге"
        aside={
          <Link href="/admin/products">
            <Button type="button" variant="outline" size="sm">
              ← К списку товаров
            </Button>
          </Link>
        }
      />

      {errorMsg && <Alert tone="error">{errorMsg}</Alert>}

      {successMsg && <Alert tone="success">{successMsg}</Alert>}

      <Card tone="surface" className="p-6 sm:p-8 space-y-6">

        {/* 01 — Basic Info */}
        <div className="space-y-4">
          <span className="label block">01</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Название товара *"
              type="text"
              required
              placeholder="Zento Nova Pro 5G"
              value={name}
              onChange={handleNameChange}
            />

            <Input
              label="Служебная ссылка (Slug) *"
              type="text"
              required
              placeholder="zento-nova-pro-5g"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </div>
        </div>

        {/* 02 — Brand & Category Selectors */}
        <div className="border-t border-line pt-6 space-y-4">
          <span className="label block">02</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Brand Selector (What appears ABOVE the product title) */}
            <div className="w-full">
              <label htmlFor="brandSlug" className="label block mb-2 text-ink-2">
                Бренд (над названием) *
              </label>
              <select
                id="brandSlug"
                value={brandSlug}
                onChange={(e) => setBrandSlug(e.target.value)}
                className="field"
              >
                <option value="zentotech">ZentoTech</option>
                <option value="aura-audio">Aura Audio</option>
                <option value="nova-electronics">Nova Electronics</option>
                <option value="pulse-lab">Pulse Lab</option>
              </select>
            </div>

            {/* Category Selector */}
            <div className="w-full">
              <label htmlFor="categorySlug" className="label block mb-2 text-ink-2">
                Категория товара *
              </label>
              <select
                id="categorySlug"
                value={categorySlug}
                onChange={(e) => setCategorySlug(e.target.value)}
                className="field"
              >
                <option value="smartphones">Смартфоны (Smartphones)</option>
                <option value="laptops">Ноутбуки (Laptops)</option>
                <option value="tablets">Планшеты (Tablets)</option>
                <option value="headphones">Наушники (Headphones)</option>
                <option value="smart-watches">Смарт-часы (Smart Watches)</option>
                <option value="accessories">Аксессуары (Accessories)</option>
              </select>
            </div>

          </div>
        </div>

        {/* 03 — Price & Stock */}
        <div className="border-t border-line pt-6 space-y-4">
          <span className="label block">03</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Цена в MDL *"
              type="number"
              required
              min="1"
              placeholder="899"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            <Input
              label="Остаток на складе (шт) *"
              type="number"
              required
              min="0"
              placeholder="25"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </div>
        </div>

        {/* 04 — Description */}
        <div className="border-t border-line pt-6 space-y-4">
          <span className="label block">04</span>
          <div className="w-full">
            <label htmlFor="description" className="label block mb-2 text-ink-2">
              Описание товара *
            </label>
            <textarea
              id="description"
              required
              rows={4}
              placeholder="Флагманский смартфон с 6.7-дюймовым OLED экраном 120 Гц..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="field"
            />
          </div>
        </div>

        {/* 05 — Image Upload & URL */}
        <div className="border-t border-line pt-6 space-y-4">
          <span className="label block">05</span>
          <span className="label block text-ink-2">Фотография товара</span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
            <div className="space-y-2">
              <span className="text-[12px] text-ink-3 block">Загрузить фото с компьютера:</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="block w-full text-small text-ink-3 cursor-pointer file:mr-3 file:h-9 file:px-3 file:rounded-sm file:border file:border-line file:bg-surface file:text-[13px] file:font-medium file:text-ink file:cursor-pointer file:transition-colors hover:file:border-ink"
              />
            </div>

            <Input
              label="Или вставьте URL ссылку:"
              type="text"
              placeholder="https://... или products/.../main.webp"
              value={imageUrl.startsWith("data:") ? "" : imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>

          {/* Live Thumbnail Preview */}
          {imageUrl && (
            <div className="pt-2 flex items-center gap-4">
              <span className="text-[12px] text-ink-3">Предпросмотр фото:</span>
              <div className="plate w-20 h-20 rounded-sm shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt="Product preview"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          )}
        </div>

        {/* 06 — Options */}
        <div className="border-t border-line pt-6 space-y-4">
          <span className="label block">06</span>
          <div className="flex items-center gap-2.5">
            <input
              type="checkbox"
              id="isFeatured"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 accent-signal cursor-pointer"
            />
            <label htmlFor="isFeatured" className="text-small text-ink-2 cursor-pointer">
              Выводить товар в блоке «Рекомендуемые» на главной странице
            </label>
          </div>
        </div>

        {/* Form Actions */}
        <div className="border-t border-line pt-6 flex justify-end gap-3">
          <Link href="/admin/products">
            <Button type="button" variant="outline" size="md">
              Отмена
            </Button>
          </Link>

          <Button type="submit" isLoading={loading} size="md">
            Сохранить товар в каталог
            <span className="arrow" aria-hidden="true">→</span>
          </Button>
        </div>

      </Card>
    </form>
  );
}
