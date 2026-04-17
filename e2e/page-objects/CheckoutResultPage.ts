import {expect, type Page} from "@playwright/test";

export class CheckoutResultPage {
    private readonly page: Page;

    public constructor(page: Page) {
        this.page = page;
    }

    public async expectSuccess(orderNumber: string): Promise<void> {
        await expect(this.page).toHaveURL(/\/en\/checkout\/result\?sessionId=sess_123$/);
        await expect(this.page.getByText(orderNumber)).toBeVisible();
        await expect(this.page.getByTestId("checkout-result-track-order")).toBeEnabled();
    }

    public async trackOrder(): Promise<void> {
        await this.page.getByTestId("checkout-result-track-order").click();
        await this.page.waitForURL("**/en/order/order-1");
    }
}
