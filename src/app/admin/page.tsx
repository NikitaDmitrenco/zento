import Link from "next/link";
import { db } from "../../db";
import { demoProducts } from "../../db/data/demo-data";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";

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

  return (
    <div className="space-y-8">
      
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Панель управления Zento
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Обзор состояния магазина, товаров и заказов
          </p>
        </div>

        <Link href="/admin/products/new">
          <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold">
            + Добавить товар
          </Button>
        </Link>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Всего товаров</p>
              <h3 className="text-3xl font-black text-slate-900 mt-2">{productCount}</h3>
            </div>
            <span className="p-2 bg-blue-50 text-blue-600 rounded-lg text-lg">📦</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Активные заказы</p>
              <h3 className="text-3xl font-black text-slate-900 mt-2">{orderCount}</h3>
            </div>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg text-lg">🛒</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Пользователи</p>
              <h3 className="text-3xl font-black text-slate-900 mt-2">{userCount}</h3>
            </div>
            <span className="p-2 bg-purple-50 text-purple-600 rounded-lg text-lg">👥</span>
          </div>
        </Card>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900">Управление каталогом</h3>
          <p className="text-xs text-slate-500">
            Создание новых позиций цифровой техники, изменение цен, остатков на складе и деактивация устаревших позиций.
          </p>
          <Link href="/admin/products">
            <Button variant="outline" size="sm" className="w-full">
              Перейти к товарам →
            </Button>
          </Link>
        </Card>

        <Card className="p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900">Управление заказами</h3>
          <p className="text-xs text-slate-500">
            Просмотр поступающих заказов от клиентов, изменение статусов (PENDING, PROCESSING, SHIPPED, COMPLETED).
          </p>
          <Link href="/admin/orders">
            <Button variant="outline" size="sm" className="w-full">
              Перейти к заказам →
            </Button>
          </Link>
        </Card>
      </div>

    </div>
  );
}
