import { getAllAdminOrders } from "../../../services/orders/order-service";
import { Badge } from "../../../components/ui/badge";
import { SectionHead } from "../../../components/ui/section-head";

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
    <div className="space-y-10">

      <SectionHead
        as="h1"
        index="—"
        title={`Управление заказами (${orderList.length})`}
        subtitle="Отслеживание поступающих заказов в реальном времени и управление статусами отгрузки"
      />

      <div className="bg-surface border border-line rounded-md overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>ID Заказа</th>
              <th>Клиент</th>
              <th>Контакты & Адрес</th>
              <th>Оплата</th>
              <th>Сумма</th>
              <th>Статус</th>
              <th>Дата оформления</th>
            </tr>
          </thead>
          <tbody>
            {orderList.map((ord) => (
              <tr key={ord.id}>
                <td className="data text-[12px] text-ink">{ord.id}</td>
                <td className="font-medium text-ink">{ord.customerName}</td>
                <td className="text-ink-2">
                  <span className="text-ink font-medium">{ord.customerEmail}</span>
                  <br />
                  <span className="data">{ord.customerPhone}</span>
                  {ord.shippingAddress && (
                    <span className="block text-[12px] text-ink-3 mt-0.5 truncate max-w-xs">
                      {ord.shippingAddress}
                    </span>
                  )}
                </td>
                <td>
                  {ord.paymentMethod === "CARD" || ord.status === "CONFIRMED" ? (
                    <Badge variant="success">Картой онлайн</Badge>
                  ) : (
                    <Badge variant="outline">При получении</Badge>
                  )}
                </td>
                <td className="data font-medium text-ink whitespace-nowrap">
                  {(ord.totalAmount / 100).toLocaleString("ru")} MDL
                </td>
                <td>{getStatusBadge(ord.status)}</td>
                <td className="data text-ink-3 whitespace-nowrap">
                  {new Date(ord.createdAt).toLocaleString("ru")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
