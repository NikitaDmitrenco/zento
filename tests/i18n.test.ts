import { describe, it, expect } from "vitest";
import { isValidLocale, locales } from "../src/i18n/config";
import { getDictionary } from "../src/i18n/get-dictionary";

describe("i18n Localization Subsystem", () => {
  it("should validate supported locales (ru, en, ro)", () => {
    expect(locales).toEqual(["ru", "en", "ro"]);
    expect(isValidLocale("ru")).toBe(true);
    expect(isValidLocale("en")).toBe(true);
    expect(isValidLocale("ro")).toBe(true);
    expect(isValidLocale("de")).toBe(false);
  });

  it("should load valid Russian dictionary with required keys", async () => {
    const ru = await getDictionary("ru");
    expect(ru.common.brand).toBe("zento");
    expect(ru.nav.catalog).toBe("Каталог");
    expect(ru.common.currency).toBe("MDL");
  });

  it("should load valid English dictionary with required keys", async () => {
    const en = await getDictionary("en");
    expect(en.common.brand).toBe("zento");
    expect(en.nav.catalog).toBe("Catalog");
  });

  it("should load valid Romanian dictionary with required keys", async () => {
    const ro = await getDictionary("ro");
    expect(ro.common.brand).toBe("zento");
    expect(ro.nav.catalog).toBe("Catalog");
  });
});
