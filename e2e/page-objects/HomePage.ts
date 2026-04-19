import {expect, type Page} from "@playwright/test";

const HOME_PRODUCTS_READY_TIMEOUT_MS = 15_000;

export class HomePage {
    private readonly page: Page;

    public constructor(page: Page) {
        this.page = page;
    }

    public async goto(): Promise<void> {
        const refreshSessionResponse = this.page.waitForResponse((response) => {
            const url = new URL(response.url());

            return url.pathname === "/auth/refresh" && response.request().method() === "POST";
        });
        const cartResponse = this.page.waitForResponse((response) => {
            const url = new URL(response.url());

            return url.pathname === "/cart" && response.request().method() === "GET";
        });
        const trendingTagsResponse = this.page.waitForResponse((response) => {
            const url = new URL(response.url());

            return url.pathname === "/tags/popular" && response.request().method() === "GET";
        });

        await this.page.goto("/en");
        await refreshSessionResponse;
        await cartResponse;
        await trendingTagsResponse;
        await expect(this.page.getByTestId(/^product-card-/).first()).toBeVisible({
            timeout: HOME_PRODUCTS_READY_TIMEOUT_MS,
        });
    }

    public async addFirstProductToCart(): Promise<void> {
        await Promise.all([
            this.page.waitForResponse((response) => {
                const url = new URL(response.url());

                return url.pathname === "/cart/add" && response.request().method() === "POST";
            }),
            this.page.getByTestId(/^add-to-cart-/).first().click(),
        ]);
    }

    public async openCartPreview(): Promise<void> {
        await this.page.getByTestId("cart-preview-trigger").click();
        await expect(this.page.getByTestId("cart-preview-view-cart")).toBeVisible();
    }

    public async goToCart(): Promise<void> {
        await this.page.getByTestId("cart-preview-view-cart").click();
        await this.page.waitForURL("**/en/cart");
    }
}
