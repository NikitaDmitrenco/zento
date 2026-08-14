import { expect, test } from "@playwright/test";

test("shows the Zento landing page", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "zento" })).toBeVisible();
});
