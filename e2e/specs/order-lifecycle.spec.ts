import {expect, test} from "../fixtures/test";
import {createOrderFromScenario} from "../mocks/api/scenario";

const ORDER_STATUS_CONFIRMED = "CONFIRMED";
const ORDER_STATUS_CANCELLED = "CANCELLED";

test("cancels a confirmed order from the order page", async ({page, orderPage, scenario}) => {
    scenario.createdOrder = createOrderFromScenario(scenario, "order-1", {
        orderStatus: ORDER_STATUS_CONFIRMED,
    });

    await page.goto("/en/order/order-1");

    await expect(page.getByTestId("order-cancel-trigger")).toBeVisible();

    await orderPage.cancelOrder();

    await orderPage.expectCancelled();
    await expect.poll(() => scenario.createdOrder?.status).toBe(ORDER_STATUS_CANCELLED);
});
