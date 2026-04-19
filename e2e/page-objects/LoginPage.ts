import {expect, type Page} from "@playwright/test";

export class LoginPage {
    private static readonly VISIBILITY_TIMEOUT_MS = 20_000;

    private readonly page: Page;

    public constructor(page: Page) {
        this.page = page;
    }

    public async expectVisible(): Promise<void> {
        await this.page.waitForURL("**/en/login");
        await expect(this.page.getByTestId("login-page")).toBeVisible({
            timeout: LoginPage.VISIBILITY_TIMEOUT_MS,
        });
        await expect(this.page.getByTestId("submit-button")).toBeVisible({
            timeout: LoginPage.VISIBILITY_TIMEOUT_MS,
        });
    }
}
