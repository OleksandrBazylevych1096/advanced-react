import {expect, type Page} from "@playwright/test";

export class SettingsOrdersPage {
    private readonly page: Page;

    public constructor(page: Page) {
        this.page = page;
    }

    public async goto(): Promise<void> {
        await this.page.goto("/en/settings/orders");
        await expect(this.page.getByTestId("settings-orders-page")).toBeVisible();
    }

    public async filterDelivered(): Promise<void> {
        await this.page.getByTestId("settings-orders-filter-completed").click();
    }

    public async expectOrderVisible(orderNumber: string): Promise<void> {
        await expect(this.page.getByText(orderNumber)).toBeVisible();
    }

    public async expectOrderHidden(orderNumber: string): Promise<void> {
        await expect(this.page.getByText(orderNumber)).not.toBeVisible();
    }
}
