import Link from "next/link";
import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { products, categories, brands } from "../../../db/schema";
import { demoProducts } from "../../../db/data/demo-data";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { SectionHead } from "../../../components/ui/section-head";

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
    <div className="space-y-10">

      <SectionHead
        as="h1"
        index="—"
        title={`Управление товарами (${productList.length})`}
        subtitle="Просмотр, редактирование цен и остатков цифровой техники"
        aside={
          <Link href="/admin/products/new">
            <Button size="sm">+ Создать товар</Button>
          </Link>
        }
      />

      <div className="bg-surface border border-line rounded-md overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Название</th>
              <th>Категория</th>
              <th>Бренд</th>
              <th>Цена</th>
              <th>Склад</th>
              <th>Статус</th>
              <th className="text-right">Действия</th>
            </tr>
          </thead>
          <tbody>
            {productList.map((prod) => (
              <tr key={prod.id}>
                <td className="font-medium text-ink">{prod.name}</td>
                <td className="text-ink-2">{prod.categorySlug}</td>
                <td className="text-ink-2">{prod.brandSlug}</td>
                <td className="data font-medium text-ink whitespace-nowrap">
                  {(prod.price / 100).toLocaleString("ru")} MDL
                </td>
                <td className="data text-ink-2 whitespace-nowrap">{prod.stock} шт.</td>
                <td>
                  {prod.isActive ? (
                    <Badge variant="success">Активен</Badge>
                  ) : (
                    <Badge variant="danger">Неактивен</Badge>
                  )}
                </td>
                <td className="text-right py-2 align-middle">
                  <Link href={`/ru/product/${prod.slug}`} target="_blank">
                    <Button size="sm" variant="ghost">Просмотр</Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
