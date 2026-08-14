import { describe, it, expect } from "vitest";
import { createOrder, checkoutSchema } from "../src/services/orders/order-service";

describe("Checkout & Order Creation Subsystem", () => {
  it("should validate valid checkout input using Zod schema", () => {
    const validData = {
      customerName: "Nikita Dmitrenco",
      customerEmail: "nikita@zento.tech",
      customerPhone: "+373 60 123456",
      shippingAddress: "Chisinau, Bd. Stefan cel Mare 1",
      items: [{ id: "zento-nova-pro-5g", quantity: 1 }],
    };

    const parsed = checkoutSchema.parse(validData);
    expect(parsed.customerName).toBe("Nikita Dmitrenco");
    expect(parsed.customerEmail).toBe("nikita@zento.tech");
  });

  it("should reject invalid customer data (short name or bad email)", () => {
    const invalidData = {
      customerName: "N",
      customerEmail: "invalid-email",
      customerPhone: "123",
      shippingAddress: "123",
      items: [],
    };

    expect(() => checkoutSchema.parse(invalidData)).toThrow();
  });

  it("should create order with PENDING status and preserve unit price snapshots", async () => {
    const orderResult = await createOrder({
      customerName: "Test Customer",
      customerEmail: "test@zento.tech",
      customerPhone: "+373 60 999888",
      shippingAddress: "Test Address 123",
      items: [
        { id: "zento-nova-pro-5g", quantity: 2 }, // price: 89900
      ],
    });

    expect(orderResult.orderId).toBeDefined();
    expect(orderResult.status).toBe("PENDING");
    expect(orderResult.totalAmount).toBe(179800);
    expect(orderResult.items).toHaveLength(1);
    expect(orderResult.items[0].unitPrice).toBe(89900);
    expect(orderResult.items[0].totalAmount).toBe(179800);
  });
});
