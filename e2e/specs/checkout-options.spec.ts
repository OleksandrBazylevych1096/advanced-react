import {type Page} from "@playwright/test";

import {expect, test} from "../fixtures/test";
import type {CartPage} from "../page-objects/CartPage";
import type {HomePage} from "../page-objects/HomePage";

interface SummaryResponse {
    coupon?: {
        discountAmount: number;
    };
    totals: {
        total: number;
        subtotal: number;
    };
}

const isSummaryResponse = (value: unknown): value is SummaryResponse => {
    if (typeof value !== "object" || value === null) {
        return false;
    }

    if (!("totals" in value)) {
        return false;
    }

    const totals = value.totals;

    if (typeof totals !== "object" || totals === null) {
        return false;
    }

    if (!("total" in totals) || !("subtotal" in totals)) {
        return false;
    }

    const coupon = "coupon" in value ? value.coupon : undefined;

    return (
        typeof totals.total === "number" &&
        typeof totals.subtotal === "number" &&
        (coupon === undefined ||
            (typeof coupon === "object" &&
                coupon !== null &&
                "discountAmount" in coupon &&
                typeof coupon.discountAmount === "number"))
    );
};

const prepareCheckout = async (
    page: Page,
    homePage: HomePage,
    cartPage: CartPage,
    productName: string,
    streetAddress: string,
): Promise<void> => {
    await homePage.goto();
    await homePage.addFirstProductToCart();
    await homePage.openCartPreview();
    await homePage.goToCart();
    await cartPage.proceedToCheckout();
    await expect(page.getByTestId("checkout-page")).toBeVisible();
    await expect(page.getByText(productName)).toBeVisible();
    await expect(page.getByTestId("checkout-delivery-address-trigger")).toContainText(
        streetAddress,
    );
};

test("applies a valid coupon and refreshes checkout summary", async ({
    page,
    homePage,
    cartPage,
    checkoutPage,
    scenario,
}) => {
    const firstProduct = scenario.products[0];
    await prepareCheckout(
        page,
        homePage,
        cartPage,
        firstProduct.name,
        scenario.defaultAddress.streetAddress,
    );

    const validateCouponResponse = page.waitForResponse((response) => {
        const url = new URL(response.url());

        return (
            url.pathname === "/checkout/validate-coupon" &&
            url.searchParams.get("couponCode") === "SAVE20"
        );
    });
    const summaryResponse = page.waitForResponse((response) => {
        const url = new URL(response.url());

        return (
            url.pathname === "/checkout/summary" && url.searchParams.get("couponCode") === "SAVE20"
        );
    });

    await checkoutPage.applyCoupon("SAVE20");

    await checkoutPage.expectCouponApplied("SAVE20");
    await expect((await validateCouponResponse).ok()).toBeTruthy();
    const summaryPayload: unknown = await (await summaryResponse).json();
    expect(isSummaryResponse(summaryPayload)).toBeTruthy();
    if (!isSummaryResponse(summaryPayload)) {
        throw new Error("Unexpected checkout summary payload");
    }
    expect(summaryPayload.coupon?.discountAmount).toBe(20);
});

test("shows validation error for invalid coupon", async ({
    page,
    homePage,
    cartPage,
    checkoutPage,
    scenario,
}) => {
    const firstProduct = scenario.products[0];
    await prepareCheckout(
        page,
        homePage,
        cartPage,
        firstProduct.name,
        scenario.defaultAddress.streetAddress,
    );

    await checkoutPage.applyCoupon("BAD");

    await checkoutPage.expectCouponValidationError();
});

test("updates summary when delivery tip changes", async ({
    page,
    homePage,
    cartPage,
    checkoutPage,
    scenario,
}) => {
    const firstProduct = scenario.products[0];
    await prepareCheckout(
        page,
        homePage,
        cartPage,
        firstProduct.name,
        scenario.defaultAddress.streetAddress,
    );

    const summaryResponse = page.waitForResponse((response) => {
        const url = new URL(response.url());

        return url.pathname === "/checkout/summary" && url.searchParams.get("tipAmount") === "10";
    });

    await checkoutPage.selectDeliveryTip(10);

    const summaryPayload: unknown = await (await summaryResponse).json();
    expect(isSummaryResponse(summaryPayload)).toBeTruthy();
    if (!isSummaryResponse(summaryPayload)) {
        throw new Error("Unexpected checkout summary payload");
    }
    expect(summaryPayload.totals.total).toBeGreaterThan(summaryPayload.totals.subtotal);
});

test("updates saved delivery date and time", async ({
    page,
    homePage,
    cartPage,
    checkoutPage,
    scenario,
}) => {
    const firstProduct = scenario.products[0];
    await prepareCheckout(
        page,
        homePage,
        cartPage,
        firstProduct.name,
        scenario.defaultAddress.streetAddress,
    );

    await checkoutPage.chooseDeliverySlot("2026-03-13", "16:00");

    await expect.poll(() => scenario.deliverySelection.deliveryTime).toBe("16:00");
});
