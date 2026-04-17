import {expect, test} from "../fixtures/test";

test("redirects routes without a language prefix to the fallback language", async ({page}) => {
    await page.goto("/");

    await expect(page).toHaveURL(/\/en\/?$/);
});

test("shows an error when checkout result page is opened without session id", async ({page}) => {
    await page.goto("/en/checkout/result");

    await expect(page.getByTestId("checkout-result-missing-session")).toBeVisible();
});
