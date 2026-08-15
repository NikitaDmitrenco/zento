import { describe, it, expect } from "vitest";
import { demoProducts } from "../src/db/seed";

describe("Product Page & Details Subsystem", () => {
  it("should have unique valid slugs for all demo products", () => {
    const slugs = demoProducts.map((p) => p.slug);
    const uniqueSlugs = new Set(slugs);
    expect(uniqueSlugs.size).toEqual(slugs.length);
  });

  it("should locate product by slug", () => {
    const flagship = demoProducts.find((p) => p.slug === "apple-iphone-16-pro-max-2024");
    expect(flagship).toBeDefined();
    expect(flagship?.name).toBe("Apple iPhone 16 Pro Max (2024)");
    expect(flagship?.price).toBe(2799900);
    expect(flagship?.stock).toBe(15);
  });
});
