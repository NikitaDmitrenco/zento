import { describe, it, expect } from "vitest";
import { demoCategories, demoBrands, demoProducts } from "../src/db/seed";

describe("Database Schema & Seed Baseline", () => {
  it("should have 6 defined categories", () => {
    expect(demoCategories).toHaveLength(6);
    expect(demoCategories.map((c) => c.slug)).toContain("smartphones");
    expect(demoCategories.map((c) => c.slug)).toContain("laptops");
  });

  it("should have 4 defined brands", () => {
    expect(demoBrands).toHaveLength(4);
    expect(demoBrands.map((b) => b.slug)).toContain("zentotech");
  });

  it("should have at least 20 demo digital technology products", () => {
    expect(demoProducts.length).toBeGreaterThanOrEqual(20);
  });

  it("every product should have valid price in integer cents, stock, category, brand, and specifications", () => {
    demoProducts.forEach((product) => {
      expect(product.name).toBeDefined();
      expect(product.slug).toMatch(/^[a-z0-9-]+$/);
      expect(Number.isInteger(product.price)).toBe(true);
      expect(product.price).toBeGreaterThan(0);
      expect(product.stock).toBeGreaterThanOrEqual(0);
      expect(product.specs.length).toBeGreaterThan(0);
      expect(product.images.length).toBeGreaterThan(0);
    });
  });
});
