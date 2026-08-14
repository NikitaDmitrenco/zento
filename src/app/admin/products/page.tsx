import Link from "next/link";
import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { products, categories, brands } from "../../../db/schema";
import { demoProducts } from "../../../db/data/demo-data";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";

export default async function AdminProductsPage() {
  let productList: {
    id: string;
    name: string;
    slug: string;
    price: number;
    stock: number;
    categorySlug: string;
    brandSlug: string;
    isActive: boolean;
  }[] = [];

  try {
    const dbProds = await db.select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      price: products.price,
      stock: products.stock,
      isActive: products.isActive,
      categoryName: categories.name,
      brandName: brands.name,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .innerJoin(brands, eq(products.brandId, brands.id));

    if (dbProds.length > 0) {
      productList = dbProds.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        stock: p.stock,
        categorySlug: p.categoryName,
        brandSlug: p.brandName,
        isActive: p.isActive,
      }));
    }
  } catch {
    // Offline fallback
  }

  if (productList.length === 0) {
    productList = demoProducts.map((p, i) => ({
      id: `demo-${i + 1}`,
      name: p.name,
      slug: p.slug,
      price: p.price,
      stock: p.stock,
      categorySlug: p.categorySlug,
      brandSlug: p.brandSlug,
      isActive: true,
    }));
  }

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Управление товарами ({productList.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Просмотр, редактирование цен и остатков цифровой техники
          </p>
        </div>

        <Link href="/admin/products/new">
          <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold">
            + Создать товар
          </Button>
        </Link>
      </div>

      <Card className="overflow-hidden border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="px-4 py-3">Название</th>
                <th className="px-4 py-3">Категория</th>
                <th className="px-4 py-3">Бренд</th>
                <th className="px-4 py-3">Цена</th>
                <th className="px-4 py-3">Склад</th>
                <th className="px-4 py-3">Статус</th>
                <th className="px-4 py-3 text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {productList.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-bold text-slate-900">{prod.name}</td>
                  <td className="px-4 py-3">{prod.categorySlug}</td>
                  <td className="px-4 py-3">{prod.brandSlug}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    {(prod.price / 100).toLocaleString("ru")} MDL
                  </td>
                  <td className="px-4 py-3 font-mono">{prod.stock} шт.</td>
                  <td className="px-4 py-3">
                    {prod.isActive ? (
                      <Badge variant="success">Активен</Badge>
                    ) : (
                      <Badge variant="danger">Неактивен</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <Link href={`/ru/product/${prod.slug}`} target="_blank">
                      <Button size="sm" variant="ghost" className="text-[11px] py-1 px-2">
                        👁 Просмотр
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

    </div>
  );
}
