import {expect, test} from "../fixtures/test";

test("opens category page and renders catalog", async ({page, scenario}) => {
    const category = scenario.categories[0];

    await page.goto(`/en/category/${category.slug}`);

    await expect(page.getByTestId("catalog-grid")).toBeVisible({timeout: 15_000});
    await expect(page.getByText(category.name)).toBeVisible();
});

test("opens search page with query and renders catalog", async ({page, scenario}) => {
    const product = scenario.products[0];

    await page.goto(`/en/search?q=${encodeURIComponent(product.name.slice(0, 3))}`);

    await expect(page.getByRole("heading", {level: 1})).toBeVisible();
    await expect(page.getByTestId("catalog-grid")).toBeVisible();
});

test("opens product page and allows adding to cart", async ({page, scenario}) => {
    const product = scenario.products[0];

    await page.goto(`/en/product/${product.slug}`);

    await expect(page.getByTestId(`add-to-cart-${product.id}`).first()).toBeVisible({
        timeout: 15_000,
    });
    await page.getByTestId(`add-to-cart-${product.id}`).first().click();
    await expect.poll(() => scenario.cartItems.length).toBe(1);
});
