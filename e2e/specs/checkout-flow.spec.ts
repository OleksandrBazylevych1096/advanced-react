import {expect, test} from "../fixtures/test";

test("completes checkout from home to order details", async ({
    cartPage,
    checkoutPage,
    checkoutResultPage,
    homePage,
    orderPage,
    scenario,
}) => {
    const firstProduct = scenario.products[0];

    await homePage.goto();
    await homePage.addFirstProductToCart();
    await homePage.openCartPreview();
    await homePage.goToCart();

    await cartPage.expectProduct(firstProduct.id, firstProduct.name);
    await cartPage.proceedToCheckout();

    await checkoutPage.expectReady(firstProduct.name, scenario.defaultAddress.streetAddress);
    await checkoutPage.placeOrder();

    await checkoutResultPage.expectSuccess("ORD-2026-0001");
    await checkoutResultPage.trackOrder();

    await orderPage.expectOrder("ORD-2026-0001", firstProduct.name);
    await expect.poll(() => scenario.createdOrder?.id ?? null).toBe("order-1");
});
