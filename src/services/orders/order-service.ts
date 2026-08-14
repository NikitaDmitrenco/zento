import { z } from "zod";
import { db } from "../../db";
import { orders, orderItems } from "../../db/schema";
import { evaluateCart, RawCartItem } from "../cart/cart-service";
import { getSession } from "../../lib/auth/session";

export const checkoutSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerEmail: z.string().email("Invalid email address"),
  customerPhone: z.string().min(6, "Phone number must be at least 6 characters"),
  shippingAddress: z.string().min(5, "Address must be at least 5 characters"),
  items: z.array(
    z.object({
      id: z.string(),
      quantity: z.number().int().min(1),
    })
  ).min(1, "Cart cannot be empty"),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export interface CreatedOrderResult {
  orderId: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  status: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "COMPLETED" | "CANCELLED";
  totalAmount: number; // in cents/minor units
  items: {
    productName: string;
    unitPrice: number;
    quantity: number;
    totalAmount: number;
  }[];
}

export interface AdminOrderRecord {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  totalAmount: number;
  status: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "COMPLETED" | "CANCELLED";
  createdAt: Date;
  items?: {
    productName: string;
    unitPrice: number;
    quantity: number;
    totalAmount: number;
  }[];
}

// In-memory runtime order cache for offline demo environment
const runtimeOrders: AdminOrderRecord[] = [
  {
    id: "ORD-984123",
    customerName: "Иван Петров",
    customerEmail: "ivan@zento.tech",
    customerPhone: "+373 69 112233",
    shippingAddress: "г. Кишинев, ул. Алба-Юлия 12",
    totalAmount: 89900,
    status: "PENDING",
    createdAt: new Date(),
  },
  {
    id: "ORD-984122",
    customerName: "Мария Чебан",
    customerEmail: "maria@zento.tech",
    customerPhone: "+373 60 445566",
    shippingAddress: "г. Кишинев, ул. Пушкина 4",
    totalAmount: 189900,
    status: "CONFIRMED",
    createdAt: new Date(Date.now() - 3600000 * 24),
  },
];

export async function getAllAdminOrders(): Promise<AdminOrderRecord[]> {
  try {
    const dbOrders = await db.query.orders.findMany({
      orderBy: (ordersTable, { desc }) => [desc(ordersTable.createdAt)],
    });
    if (dbOrders.length > 0) {
      const dbRecords: AdminOrderRecord[] = dbOrders.map((o) => ({
        id: o.id,
        customerName: o.customerName,
        customerEmail: o.customerEmail,
        customerPhone: o.customerPhone,
        shippingAddress: o.shippingAddress,
        totalAmount: o.totalAmount,
        status: o.status,
        createdAt: o.createdAt,
      }));
      const combined = [...runtimeOrders];
      for (const dbo of dbRecords) {
        if (!combined.some((c) => c.id === dbo.id)) {
          combined.push(dbo);
        }
      }
      return combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  } catch {
    // Offline mode
  }
  return [...runtimeOrders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function createOrder(input: CheckoutInput): Promise<CreatedOrderResult> {
  const validated = checkoutSchema.parse(input);

  // Evaluate cart server-side for prices and stock validation
  const rawCartItems: RawCartItem[] = validated.items.map((i) => ({
    id: i.id,
    quantity: i.quantity,
  }));

  const cart = await evaluateCart(rawCartItems);

  if (cart.items.length === 0) {
    throw new Error("EMPTY_CART");
  }

  if (cart.hasStockIssues) {
    throw new Error("STOCK_VALIDATION_FAILED");
  }

  // Check if current user session is present
  let session = null;
  try {
    session = await getSession();
  } catch {
    // Outside Next.js request scope (e.g. unit test runner)
  }

  const totalAmount = cart.subtotal;
  const generatedOrderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

  try {
    const [newOrder] = await db
      .insert(orders)
      .values({
        id: generatedOrderId,
        userId: session?.userId || null,
        customerName: validated.customerName,
        customerEmail: validated.customerEmail.toLowerCase(),
        customerPhone: validated.customerPhone,
        shippingAddress: validated.shippingAddress,
        status: "PENDING",
        totalAmount,
      })
      .returning();

    const orderItemsToInsert = cart.items.map((item) => ({
      orderId: newOrder.id,
      productId: item.id.startsWith("demo-") ? null : item.id,
      productName: item.name,
      unitPrice: item.price, // price snapshot at moment of purchase
      quantity: item.quantity,
      totalAmount: item.totalPrice,
    }));

    await db.insert(orderItems).values(orderItemsToInsert);

    const result: CreatedOrderResult = {
      orderId: newOrder.id,
      customerName: newOrder.customerName,
      customerEmail: newOrder.customerEmail,
      shippingAddress: newOrder.shippingAddress,
      status: newOrder.status,
      totalAmount: newOrder.totalAmount,
      items: orderItemsToInsert.map((i) => ({
        productName: i.productName,
        unitPrice: i.unitPrice,
        quantity: i.quantity,
        totalAmount: i.totalAmount,
      })),
    };

    runtimeOrders.unshift({
      id: result.orderId,
      customerName: result.customerName,
      customerEmail: result.customerEmail,
      customerPhone: validated.customerPhone,
      shippingAddress: result.shippingAddress,
      totalAmount: result.totalAmount,
      status: result.status,
      createdAt: new Date(),
      items: result.items,
    });

    return result;
  } catch {
    // Database offline fallback order result
    const mockOrderId = `ORD-${Date.now().toString().slice(-6)}`;

    const result: CreatedOrderResult = {
      orderId: mockOrderId,
      customerName: validated.customerName,
      customerEmail: validated.customerEmail,
      shippingAddress: validated.shippingAddress,
      status: "PENDING",
      totalAmount,
      items: cart.items.map((item) => ({
        productName: item.name,
        unitPrice: item.price,
        quantity: item.quantity,
        totalAmount: item.totalPrice,
      })),
    };

    runtimeOrders.unshift({
      id: result.orderId,
      customerName: result.customerName,
      customerEmail: result.customerEmail,
      customerPhone: validated.customerPhone,
      shippingAddress: result.shippingAddress,
      totalAmount: result.totalAmount,
      status: result.status,
      createdAt: new Date(),
      items: result.items,
    });

    return result;
  }
}
