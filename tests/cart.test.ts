import { describe, it, expect } from "vitest";
import { evaluateCart } from "../src/services/cart/cart-service";

describe("Cart Subsystem & Stock Validation", () => {
  it("should return empty evaluated cart when raw cart items are empty", async () => {
    const result = await evaluateCart([]);
    expect(result.items).toHaveLength(0);
    expect(result.subtotal).toBe(0);
    expect(result.totalItems).toBe(0);
    expect(result.hasStockIssues).toBe(false);
  });

  it("should evaluate cart items and calculate correct subtotal and quantity bounds", async () => {
    const rawItems = [
      { id: "zento-nova-pro-5g", quantity: 2 },
      { id: "zento-audio-pro-wireless", quantity: 1 },
    ];

    const result = await evaluateCart(rawItems);
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.totalItems).toBe(3);
    
    // Nova Pro (89900 * 2 = 179800) + Audio Pro (29900 * 1 = 29900) = 209700
    expect(result.subtotal).toBe(209700);
  });

  it("should validate and cap quantity when requested quantity exceeds available stock", async () => {
    const rawItems = [{ id: "zento-nova-pro-5g", quantity: 9999 }];
    const result = await evaluateCart(rawItems);

    const novaItem = result.items.find((i) => i.slug === "zento-nova-pro-5g");
    expect(novaItem).toBeDefined();
    // Stock is 25, requested 9999 -> capped to 25
    expect(novaItem?.quantity).toBe(25);
  });
});
