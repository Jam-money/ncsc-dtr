import { test, expect } from "@playwright/test";

test("NCSC branding is readable on desktop and mobile, with only three signup categories", async ({
  page,
}) => {
  for (const width of [1280, 375]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.locator('body[data-app-hydrated="true"]').waitFor();
    await expect(page.getByAltText("National Commission of Senior Citizens")).toBeVisible();
    await expect(page.locator("body")).not.toContainText("Field Enumerator");
    await expect(page.locator("body")).not.toContainText("Philippine Statistics Authority");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.screenshot({
      path: test.info().outputPath(`ncsc-landing-${width}.png`),
      fullPage: true,
    });
  }
  await page.getByRole("link", { name: "Sign in", exact: true }).click();
  await page.getByRole("button", { name: "Sign up", exact: true }).click();
  const types = page.getByRole("combobox", { name: "Account type", exact: true });
  await expect(types.locator("option")).toHaveText([
    "OJT/Immersions",
    "JO/COS/GIP",
    "Regular / Contractual Employees",
  ]);
  await types.selectOption("job_order");
  await expect(page.getByLabel("Required workdays", { exact: true })).toHaveCount(0);
  await page.screenshot({ path: test.info().outputPath("ncsc-signup-mobile.png"), fullPage: true });
});
