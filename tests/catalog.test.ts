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
    const result = await searchCatalog({ query: "Nova" });
    result.items.forEach((item) => {
      const match =
        item.name.toLowerCase().includes("nova") ||
        item.description.toLowerCase().includes("nova");
      expect(match).toBe(true);
    });
  });

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
