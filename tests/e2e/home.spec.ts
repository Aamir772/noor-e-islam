import { expect, test, type Page } from "@playwright/test";

async function gotoWithHydration(page: Page, url: string) {
  await page.goto(url);
  await page.waitForLoadState("networkidle");
}

test("homepage presents the educational discovery structure", async ({ page }) => {
  await gotoWithHydration(page, "/");

  await expect(page.getByRole("heading", { level: 1 })).toContainText("Discover reliable Islamic knowledge");
  await expect(page.getByRole("link", { name: "Explore the Quran" }).first()).toBeVisible();

  for (const name of [
    "Quran exploration",
    "Hadith library",
    "Daily Dua",
    "Islamic fundamentals",
    "Prophet teachings",
    "Daily life guidance",
    "Myth versus fact",
    "Stories of Prophets",
  ]) {
    await expect(page.getByRole("region", { name })).toBeVisible();
  }

  await expect(page.getByRole("region", { name: "Frequently asked questions" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Privacy policy" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Terms of use" })).toBeVisible();
});

test("module pages clearly identify demonstration content", async ({ page }) => {
  await gotoWithHydration(page, "/quran");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("The Quran");
  await expect(page.getByLabel("Demonstration content notice")).toBeVisible();
  await expect(page.getByRole("region", { name: "All modules" })).toBeVisible();
});

test("language selection updates document language and direction", async ({ page }) => {
  const cases = [
    { code: "EN", lang: "en", dir: "ltr" },
    { code: "AR", lang: "ar", dir: "rtl" },
    { code: "UR", lang: "ur", dir: "rtl" },
    { code: "HI", lang: "hi", dir: "ltr" },
    { code: "UR_RO", lang: "ur-Latn", dir: "ltr" },
  ];

  for (const item of cases) {
    await gotoWithHydration(page, `/?lang=${item.code}`);
    await expect(page.locator("html")).toHaveAttribute("lang", item.lang);
    await expect(page.locator("html")).toHaveAttribute("dir", item.dir);
  }
});

test("branded 404 returns to the library", async ({ page }) => {
  await gotoWithHydration(page, "/this-page-does-not-exist");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("This page is not in the library");
  await expect(page.getByRole("link", { name: "Return home" })).toBeVisible();
});

test.describe("390px viewport", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("homepage has no horizontal overflow and shows the primary action early", async ({ page }) => {
    await gotoWithHydration(page, "/");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(overflow).toBe(false);

    const cta = page.getByRole("link", { name: "Explore the Quran" }).first();
    await expect(cta).toBeVisible();
    const box = await cta.boundingBox();
    expect(box?.y).toBeLessThan(844);
  });

  test("navigation panel supports keyboard close and focus return", async ({ page }) => {
    await gotoWithHydration(page, "/");
    const openButton = page.getByRole("button", { name: "Open navigation" });
    await openButton.click();
    await expect(page.getByRole("button", { name: "Close navigation" })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(openButton).toBeFocused();
  });
});
