import type {Page} from "@playwright/test";

import {expect, test} from "../fixtures/test";

const assertLocalizedLayout = async (page: Page): Promise<void> => {
    await expect(page.locator("header")).toBeVisible();
    await expect(page.getByTestId("language-switcher")).toBeVisible();
    await expect(page.getByTestId("not-found-page")).toHaveCount(0);
};

const waitForGermanRouteUi = async (page: Page): Promise<void> => {
    await expect(page.getByTestId("language-switcher")).toHaveAttribute("data-current-language", "de");
};

test.describe("localized slug switching", () => {
    test("switches category route from en slug to de slug when language changes", async ({
        page,
        scenario,
    }) => {
        const category = scenario.categories[0];

        expect(category.slugMap.en).not.toBe(category.slugMap.de);

        await page.goto(`/en/category/${category.slugMap.en}`);
        await expect(page.getByTestId("catalog-grid")).toBeVisible({timeout: 15_000});

        await page.getByTestId("language-switcher").click();

        await expect(page).toHaveURL(new RegExp(`/de/category/${category.slugMap.de}$`));
        await expect(page.getByTestId("catalog-grid")).toBeVisible({timeout: 15_000});
        await assertLocalizedLayout(page);
    });

    test("switches category route from de slug to en slug when language changes", async ({
        page,
        scenario,
    }) => {
        const category = scenario.categories[0];

        expect(category.slugMap.en).not.toBe(category.slugMap.de);

        await page.goto(`/de/category/${category.slugMap.de}`);
        await expect(page.getByTestId("catalog-grid")).toBeVisible({timeout: 15_000});
        await waitForGermanRouteUi(page);

        await page.getByTestId("language-switcher").click();

        await expect(page).toHaveURL(new RegExp(`/en/category/${category.slugMap.en}$`));
        await expect(page.getByTestId("catalog-grid")).toBeVisible({timeout: 15_000});
        await assertLocalizedLayout(page);
    });

    test("switches product route from en slug to de slug when language changes", async ({
        page,
        scenario,
    }) => {
        const product = scenario.products[0];

        expect(product.slugMap.en).not.toBe(product.slugMap.de);

        await page.goto(`/en/product/${product.slugMap.en}`);
        await expect(page.getByRole("heading", {name: product.name}).first()).toBeVisible();

        await page.getByTestId("language-switcher").click();

        await expect(page).toHaveURL(new RegExp(`/de/product/${product.slugMap.de}$`));
        await expect(page.getByRole("heading", {name: product.name}).first()).toBeVisible();
        await assertLocalizedLayout(page);
    });

    test("switches product route from de slug to en slug when language changes", async ({
        page,
        scenario,
    }) => {
        const product = scenario.products[0];

        expect(product.slugMap.en).not.toBe(product.slugMap.de);

        await page.goto(`/de/product/${product.slugMap.de}`);
        await expect(page.getByRole("heading", {name: product.name}).first()).toBeVisible();
        await waitForGermanRouteUi(page);

        await page.getByTestId("language-switcher").click();

        await expect(page).toHaveURL(new RegExp(`/en/product/${product.slugMap.en}$`));
        await expect(page.getByRole("heading", {name: product.name}).first()).toBeVisible();
        await assertLocalizedLayout(page);
    });
});
