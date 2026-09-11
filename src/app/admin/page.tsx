import Link from "next/link";
import { db } from "../../db";
import { demoProducts } from "../../db/data/demo-data";
import { Button } from "../../components/ui/button";
import { SectionHead } from "../../components/ui/section-head";

export default async function AdminDashboardPage() {
  let productCount = demoProducts.length;
  let orderCount = 0;
  let userCount = 1;

  try {
    const prods = await db.query.products.findMany();
    if (prods.length > 0) productCount = prods.length;

    const ords = await db.query.orders.findMany();
    orderCount = ords.length;

    const usrs = await db.query.users.findMany();
    if (usrs.length > 0) userCount = usrs.length;
  } catch {
    // Offline fallback
  }

  const stats = [
    { caption: "Всего товаров", value: productCount },
    { caption: "Активные заказы", value: orderCount },
    { caption: "Пользователи", value: userCount },
  ];

  return (
    <div className="space-y-10">

      {/* Title & Action */}
      <SectionHead
        as="h1"
        index="—"
        title="Панель управления Zento"
        subtitle="Обзор состояния магазина, товаров и заказов"
        aside={
          <Link href="/admin/products/new">
            <Button size="sm">+ Добавить товар</Button>
          </Link>
        }
      />

      {/* Overview: one ruled grid, numbers set in mono */}
      <div className="rule-grid grid-cols-1 sm:grid-cols-3">
        {stats.map((stat, i) => (
          <div key={stat.caption} className="relative p-6 bg-surface">
            <span className="label absolute top-6 right-6">{String(i + 1).padStart(2, "0")}</span>
            <p className="label">{stat.caption}</p>
            <p className="data text-[40px] font-medium leading-none text-ink mt-6">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Navigation */}
      <div className="rule-grid grid-cols-1 md:grid-cols-2">
        <div className="p-6 flex flex-col gap-4">
          <h3 className="text-h3 text-ink">Управление каталогом</h3>
          <p className="text-small text-ink-2">
            Создание новых позиций цифровой техники, изменение цен, остатков на складе и деактивация устаревших позиций.
          </p>
          <Link
            href="/admin/products"
            className="group inline-flex items-center gap-2 text-sm font-medium text-ink mt-auto"
          >
            Перейти к товарам
            <span className="arrow" aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="p-6 flex flex-col gap-4">
          <h3 className="text-h3 text-ink">Управление заказами</h3>
          <p className="text-small text-ink-2">
            Просмотр поступающих заказов от клиентов, изменение статусов (PENDING, PROCESSING, SHIPPED, COMPLETED).
          </p>
          <Link
            href="/admin/orders"
            className="group inline-flex items-center gap-2 text-sm font-medium text-ink mt-auto"
          >
            Перейти к заказам
            <span className="arrow" aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

    </div>
  );
}
