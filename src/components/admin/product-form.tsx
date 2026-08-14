"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

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
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            ➕ Добавление нового товара
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Заполните данные карточки товара для публикации в каталоге
          </p>
        </div>

        <Link href="/admin/products">
          <Button variant="outline" size="sm">
            ← К списку товаров
          </Button>
        </Link>
      </div>

      {errorMsg && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs font-medium text-red-700">
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-medium text-emerald-700">
          {successMsg}
        </div>
      )}

      <Card className="p-6 space-y-6">
        
        {/* Basic Info */}
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

        {/* Brand & Category Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Brand Selector (What appears ABOVE the product title) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Бренд (над названием) *
            </label>
            <select
              value={brandSlug}
              onChange={(e) => setBrandSlug(e.target.value)}
              className="w-full h-10 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900"
            >
              <option value="zentotech">ZentoTech</option>
              <option value="aura-audio">Aura Audio</option>
              <option value="nova-electronics">Nova Electronics</option>
              <option value="pulse-lab">Pulse Lab</option>
            </select>
          </div>

          {/* Category Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Категория товара *
            </label>
            <select
              value={categorySlug}
              onChange={(e) => setCategorySlug(e.target.value)}
              className="w-full h-10 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900"
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

        {/* Price & Stock */}
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

        {/* Description */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700">
            Описание товара *
          </label>
          <textarea
            required
            rows={4}
            placeholder="Флагманский смартфон с 6.7-дюймовым OLED экраном 120 Гц..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900"
          />
        </div>

        {/* Image Upload & URL */}
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <label className="block text-xs font-semibold text-slate-700">
            Фотография товара
          </label>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
            <div className="space-y-2">
              <span className="text-[11px] text-slate-500 block">Загрузить фото с компьютера:</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="block w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
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
            <div className="pt-2 flex items-center gap-3">
              <span className="text-xs font-medium text-slate-500">Предпросмотр фото:</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt="Product preview"
                className="w-16 h-16 object-contain rounded-lg border border-slate-200 bg-white p-1"
              />
            </div>
          )}
        </div>

        {/* Options */}
        <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
          <input
            type="checkbox"
            id="isFeatured"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
          />
          <label htmlFor="isFeatured" className="text-xs font-medium text-slate-700 cursor-pointer">
            Выводить товар в блоке «Рекомендуемые» на главной странице
          </label>
        </div>

        {/* Form Actions */}
        <div className="pt-4 flex justify-end gap-3">
          <Link href="/admin/products">
            <Button type="button" variant="outline" size="md">
              Отмена
            </Button>
          </Link>

          <Button
            type="submit"
            isLoading={loading}
            size="md"
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold"
          >
            Сохранить товар в каталог →
          </Button>
        </div>

      </Card>
    </form>
  );
}
