import {expect, type Page} from "@playwright/test";

export class OrderPage {
    private readonly page: Page;

    public constructor(page: Page) {
        this.page = page;
    }

    public async expectOrder(orderNumber: string, productName: string): Promise<void> {
        await expect(this.page).toHaveURL(/\/en\/order\/order-1$/);
        await expect(this.page.getByText(orderNumber)).toBeVisible();
        await expect(this.page.getByText(productName)).toBeVisible();
    }

    public async cancelOrder(): Promise<void> {
        await this.page.getByTestId("order-cancel-trigger").click();
        await this.page.getByTestId("order-cancel-confirm-btn").click();
    }

    public async expectCancelled(): Promise<void> {
        await expect(this.page.getByTestId("toast-notification-success")).toBeVisible();
        await expect(this.page.getByTestId("order-cancel-trigger")).toHaveCount(0);
        await expect(this.page.getByTestId("order-status-badge-cancelled")).toBeVisible();
    }
}
