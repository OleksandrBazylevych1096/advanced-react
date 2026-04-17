import {expect, test} from "../fixtures/test";

test("disables place order when checkout has no items", async ({homePage, page}) => {
    await homePage.goto();
    await page.goto("/en/checkout");

    await expect(page.getByTestId("checkout-place-order")).toBeDisabled();
});

test.describe("checkout without default address", () => {
    test.use({missingDefaultAddress: true});

    test("shows the address fallback and keeps place order disabled", async ({homePage, page}) => {
        await homePage.goto();
        await page.goto("/en/checkout");

        await expect(page.getByTestId("checkout-delivery-address-trigger")).toContainText(
            "Address not specified",
        );
        await expect(page.getByTestId("checkout-place-order")).toBeDisabled();
    });
});
