import {expect, type Page} from "@playwright/test";

export class CartPage {
    private readonly page: Page;

    public constructor(page: Page) {
        this.page = page;
    }

    public async expectProduct(_productId: string, productName: string): Promise<void> {
        await expect(this.page.getByRole("heading", {name: productName, level: 4})).toBeVisible();
    }

    public async proceedToCheckout(): Promise<void> {
        const checkoutButton = this.page.getByTestId("cart-proceed-to-checkout");

        await expect(checkoutButton).toBeEnabled();
        await checkoutButton.click();
        await this.page.waitForURL("**/en/checkout");
    }

    public async removeFirstItem(): Promise<void> {
        const firstCartItem = this.page.getByTestId(/^cart-item-/).first();
        const cartItemId = await firstCartItem.getAttribute("data-testid");

        if (!cartItemId) {
            throw new Error("Cart item test id is missing");
        }

        const productId = cartItemId.replace("cart-item-", "");
        await this.page.getByTestId(`cart-item-${productId}-remove`).click();
    }

    public async increaseFirstItemQuantity(): Promise<void> {
        const firstCartItem = this.page.getByTestId(/^cart-item-/).first();
        const cartItemId = await firstCartItem.getAttribute("data-testid");

        if (!cartItemId) {
            throw new Error("Cart item test id is missing");
        }

        const productId = cartItemId.replace("cart-item-", "");
        await this.page.getByTestId(`cart-item-${productId}-increase`).click();
    }

    public async clearCart(): Promise<void> {
        await this.page.getByTestId("cart-clear-button").click();
    }

    public async expectEmpty(): Promise<void> {
        await expect(this.page.getByTestId("empty-state")).toBeVisible();
    }

    public async expectItemsCount(count: number): Promise<void> {
        await expect(
            this.page.locator(
                '[data-testid^="cart-item-"]:not([data-testid$="-remove"]):not([data-testid$="-increase"]):not([data-testid$="-decrease"])',
            ),
        ).toHaveCount(count);
    }
}
