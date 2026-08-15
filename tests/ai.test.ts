import { describe, it, expect } from "vitest";
import { processAiChat, extractRelevantProducts } from "../src/services/ai/deepseek-service";

describe("DeepSeek AI Assistant Subsystem", () => {
  it("should generate structured response with products for smartphone query", async () => {
    const result = await processAiChat(
      [{ role: "user", content: "Посоветуй мне хороший смартфон для фото" }],
      "ru"
    );

    expect(result).toBeDefined();
    expect(typeof result.reply).toBe("string");
    expect(result.reply.length).toBeGreaterThan(20);
    expect(Array.isArray(result.products)).toBe(true);
    expect(result.products.length).toBeGreaterThan(0);
    expect(result.products[0]).toHaveProperty("slug");
    expect(result.products[0]).toHaveProperty("price");
  });

  it("should recommend laptop options for work query", async () => {
    const result = await processAiChat(
      [{ role: "user", content: "Какой ноутбук выбрать для работы и монтажа?" }],
      "ru"
    );

    expect(result.reply).toContain("MacBook");
    expect(result.products.length).toBeGreaterThan(0);
  });

  it("should extract relevant products from text and query", async () => {
    const products = await extractRelevantProducts(
      "Рекомендую отличные часы Garmin Fenix 8",
      "часы Garmin"
    );

    expect(products.length).toBeGreaterThan(0);
    expect(products.some((p) => p.slug.includes("garmin"))).toBe(true);
  });
});
