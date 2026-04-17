import {expect, type Page} from "@playwright/test";

export class LoginPage {
    private readonly page: Page;

    public constructor(page: Page) {
        this.page = page;
    }

    public async expectVisible(): Promise<void> {
        await this.page.waitForURL("**/en/login");
        await expect(this.page.getByTestId("login-page")).toBeVisible({timeout: 10_000});
        await expect(this.page.getByTestId("submit-button")).toBeVisible({timeout: 10_000});
    }
}
