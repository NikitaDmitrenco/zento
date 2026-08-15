import { getAllAdminOrders } from "../../../services/orders/order-service";
import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";

export default async function AdminOrdersPage() {
  const orderList = await getAllAdminOrders();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="warning">PENDING</Badge>;
      case "CONFIRMED":
        return <Badge variant="success">CONFIRMED</Badge>;
      case "PROCESSING":
        return <Badge variant="default">PROCESSING</Badge>;
      case "SHIPPED":
        return <Badge variant="success">SHIPPED</Badge>;
      case "COMPLETED":
        return <Badge variant="success">COMPLETED</Badge>;
      case "CANCELLED":
        return <Badge variant="danger">CANCELLED</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Управление заказами ({orderList.length})
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Отслеживание поступающих заказов в реальном времени и управление статусами отгрузки
        </p>
      </div>

      <Card className="overflow-hidden border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="px-4 py-3">ID Заказа</th>
                <th className="px-4 py-3">Клиент</th>
                <th className="px-4 py-3">Контакты & Адрес</th>
                <th className="px-4 py-3">Оплата</th>
                <th className="px-4 py-3">Сумма</th>
                <th className="px-4 py-3">Статус</th>
                <th className="px-4 py-3">Дата оформления</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {orderList.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-slate-900">{ord.id}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">{ord.customerName}</td>
                  <td className="px-4 py-3 text-slate-500">
                    <span className="text-slate-900 font-medium">{ord.customerEmail}</span>
                    <br />
                    <span>{ord.customerPhone}</span>
                    {ord.shippingAddress && (
                      <span className="block text-[10px] text-slate-400 mt-0.5 truncate max-w-xs">
                        📍 {ord.shippingAddress}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {ord.paymentMethod === "CARD" || ord.status === "CONFIRMED" ? (
                      <span className="inline-flex items-center gap-1 font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-[10px] border border-emerald-200">
                        💳 Картой онлайн
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md text-[10px] border border-slate-200">
                        💵 При получении
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-900">
                    {(ord.totalAmount / 100).toLocaleString("ru")} MDL
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(ord.status)}</td>
                  <td className="px-4 py-3 text-slate-400">
                    {new Date(ord.createdAt).toLocaleString("ru")}
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
