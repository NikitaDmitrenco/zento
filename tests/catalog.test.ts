import { describe, it, expect } from "vitest";
import { searchCatalog } from "../src/services/search/search-service";

describe("Catalog & Isolated Search Service", () => {
  it("should return products with pagination structure", async () => {
    const result = await searchCatalog({ page: 1, limit: 6 });
    expect(result.page).toBe(1);
    expect(result.limit).toBe(6);
    expect(Array.isArray(result.items)).toBe(true);
  });

  it("should filter products by category slug (smartphones)", async () => {
    const result = await searchCatalog({ categorySlug: "smartphones" });
    result.items.forEach((item) => {
      expect(item.category.slug).toBe("smartphones");
    });
  });

  it("should search products by text query", async () => {
    const result = await searchCatalog({ query: "Apple" });
    expect(result.items.length).toBeGreaterThan(0);
    result.items.forEach((item) => {
      const match =
        item.name.toLowerCase().includes("apple") ||
        item.description.toLowerCase().includes("apple");
      expect(match).toBe(true);
    });
  }, 10000);

  it("should sort products by price ascending", async () => {
    const result = await searchCatalog({ sortBy: "price_asc" });
    if (result.items.length >= 2) {
      expect(result.items[0].price).toBeLessThanOrEqual(result.items[1].price);
    }
  });

  it("should sort products by price descending", async () => {
    const result = await searchCatalog({ sortBy: "price_desc" });
    if (result.items.length >= 2) {
      expect(result.items[0].price).toBeGreaterThanOrEqual(result.items[1].price);
    }
  });
});
