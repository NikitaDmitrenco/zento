import { describe, it, expect } from "vitest";
import { getUserOrders } from "../src/services/orders/order-service";

describe("User Orders Subsystem", () => {
  it("should return empty list if no user ID or email provided", async () => {
    const orders = await getUserOrders();
    expect(orders).toEqual([]);
  });

  it("should retrieve user orders with order ID, status, and items for demo user", async () => {
    const orders = await getUserOrders("usr-user-demo", "user@zento.tech");
    expect(orders.length).toBeGreaterThan(0);
    expect(orders[0].id).toBeDefined();
    expect(orders[0].status).toBe("CONFIRMED");
    expect(orders[0].items.length).toBeGreaterThan(0);
  });
});
