import {expect, type Page} from "@playwright/test";

export class CheckoutPage {
    private readonly page: Page;

    public constructor(page: Page) {
        this.page = page;
    }

    public async expectReady(productName: string, streetAddress: string): Promise<void> {
        await expect(this.page.getByTestId("checkout-page")).toBeVisible();
        await expect(this.page.getByText(productName)).toBeVisible();
        await expect(this.page.getByTestId("checkout-delivery-address-trigger")).toContainText(
            streetAddress,
        );
        await expect(this.page.getByTestId("checkout-place-order")).toBeEnabled();
    }

    public async placeOrder(): Promise<void> {
        const placeOrderButton = this.page.getByTestId("checkout-place-order");

        await Promise.all([
            this.page.waitForResponse((response) => {
                const url = new URL(response.url());

                return url.pathname === "/checkout/payment-session" && response.request().method() === "POST";
            }),
            placeOrderButton.click(),
        ]);

        await this.page.waitForURL(/\/en\/checkout\/result\?sessionId=sess_123$/);
    }

    public async applyCoupon(code: string): Promise<void> {
        await this.page.getByTestId("coupon-open-modal").click();
        await this.page.getByTestId("coupon-input").fill(code);
        await this.page.getByTestId("coupon-apply-btn").click();
    }

    public async expectCouponApplied(code: string): Promise<void> {
        await expect(this.page.getByTestId("coupon-badge")).toContainText(code);
        await expect(this.page.getByTestId("coupon-remove-btn")).toBeVisible();
    }

    public async expectCouponValidationError(): Promise<void> {
        await expect(this.page.getByTestId("coupon-input-error")).toBeVisible();
    }

    public async selectDeliveryTip(amount: number): Promise<void> {
        await this.page.getByTestId(`delivery-tip-preset-${amount}`).click();
    }

    public async chooseDeliverySlot(date: string, time: string): Promise<void> {
        await this.page.getByTestId("delivery-date-trigger").click();
        await expect(this.page.getByTestId("choose-delivery-date-modal")).toBeVisible();
        await this.page.getByTestId(`delivery-date-${date}`).click();
        await this.page.getByTestId(`delivery-time-${time}`).click();
        await Promise.all([
            this.page.waitForResponse((response) => {
                const url = new URL(response.url());

                return (
                    url.pathname === "/delivery-selection" &&
                    response.request().method() === "PATCH"
                );
            }),
            this.page.getByTestId("delivery-apply-btn").click(),
        ]);
    }

    public async expectPaymentSessionError(): Promise<void> {
        await expect(this.page.getByTestId("checkout-payment-session-error")).toBeVisible();
    }
}
