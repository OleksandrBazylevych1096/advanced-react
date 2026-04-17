import {expect, test} from "../fixtures/test";

test.use({paymentSessionFails: true});

test("shows an error and stays on checkout when payment session creation fails", async ({
    cartPage,
    checkoutPage,
    homePage,
    scenario,
    page,
}) => {
    const firstProduct = scenario.products[0];

    await homePage.goto();
    await homePage.addFirstProductToCart();
    await homePage.openCartPreview();
    await homePage.goToCart();

    await cartPage.expectProduct(firstProduct.id, firstProduct.name);
    await cartPage.proceedToCheckout();

    await checkoutPage.expectReady(firstProduct.name, scenario.defaultAddress.streetAddress);

    await page.getByTestId("checkout-place-order").click();

    await expect(page).toHaveURL(/\/en\/checkout$/);
    await checkoutPage.expectPaymentSessionError();
});
