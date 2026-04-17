import {expect, test} from "../fixtures/test";

test.describe("cart management", () => {
    test("increments item quantity in cart", async ({cartPage, homePage, scenario}) => {
        const firstProduct = scenario.products[0];

        await homePage.goto();
        await homePage.addFirstProductToCart();
        await homePage.openCartPreview();
        await homePage.goToCart();

        await cartPage.increaseFirstItemQuantity();

        await expect.poll(() => scenario.cartItems[0]?.quantity ?? 0).toBe(2);
        await cartPage.expectItemsCount(1);
        await cartPage.expectProduct(firstProduct.id, firstProduct.name);
    });

    test("removes an item from cart", async ({cartPage, homePage}) => {
        await homePage.goto();
        await homePage.addFirstProductToCart();
        await homePage.openCartPreview();
        await homePage.goToCart();

        await cartPage.removeFirstItem();
        await cartPage.expectEmpty();
    });

    test("clears the cart", async ({cartPage, homePage}) => {
        await homePage.goto();
        await homePage.addFirstProductToCart();
        await homePage.openCartPreview();
        await homePage.goToCart();

        await cartPage.clearCart();
        await cartPage.expectEmpty();
    });
});
