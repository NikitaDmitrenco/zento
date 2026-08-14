import { describe, it, expect } from "vitest";
import { getDictionary } from "../src/i18n/get-dictionary";

describe("Legal & Moldovan Data Compliance Subsystem", () => {
  it("should have legal footer dictionary translations across all locales", async () => {
    const ru = await getDictionary("ru");
    const en = await getDictionary("en");
    const ro = await getDictionary("ro");

    expect(ru.footer.privacy).toBeDefined();
    expect(en.footer.privacy).toBeDefined();
    expect(ro.footer.privacy).toBeDefined();

    expect(ru.footer.terms).toBeDefined();
    expect(en.footer.terms).toBeDefined();
    expect(ro.footer.terms).toBeDefined();
  });
});
