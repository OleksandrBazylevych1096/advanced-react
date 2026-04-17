import {expect, test} from "../fixtures/test";

test.describe("login", () => {
    test.use({authState: "guest"});

    test("logs in with email/password and redirects to home", async ({page}) => {
        await page.goto("/en/login");

        await page.getByTestId("email-input").fill("user@example.com");
        await page.getByTestId("password-input").fill("password123");
        await page.getByTestId("submit-button").click();

        await expect(page).toHaveURL(/\/en$/);
        await expect(page.getByTestId("product-card-prod-1").first()).toBeVisible();
    });
});

test.describe("mfa login", () => {
    test.use({authState: "guest", loginMode: "mfa"});

    test("redirects to the two-factor page when login requires MFA", async ({page}) => {
        await page.goto("/en/login");

        await page.getByTestId("email-input").fill("user@example.com");
        await page.getByTestId("password-input").fill("password123");
        await page.getByTestId("submit-button").click();

        await expect(page).toHaveURL(/\/en\/two-factor$/);
        await expect(page.getByRole("heading", {level: 1})).toBeVisible();
    });
});
