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
      { id: "apple-iphone-16-pro-max-2024", quantity: 2 },
      { id: "sony-wh-1000xm5", quantity: 1 },
    ];

    const result = await evaluateCart(rawItems);
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.totalItems).toBe(3);
    
    // iPhone 16 Pro Max (2799900 * 2 = 5599800) + Sony WH-1000XM5 (749900 * 1 = 749900) = 6349700
    expect(result.subtotal).toBe(6349700);
  });

  it("should validate and cap quantity when requested quantity exceeds available stock", async () => {
    const rawItems = [{ id: "apple-iphone-16-pro-max-2024", quantity: 9999 }];
    const result = await evaluateCart(rawItems);

    const iphoneItem = result.items.find((i) => i.slug === "apple-iphone-16-pro-max-2024");
    expect(iphoneItem).toBeDefined();
    // Stock is 15, requested 9999 -> capped to 15
    expect(iphoneItem?.quantity).toBe(15);
  });
});
