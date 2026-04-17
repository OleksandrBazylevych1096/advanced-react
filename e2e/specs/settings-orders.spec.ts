import {expect, test} from "../fixtures/test";

test("filters orders by delivered status", async ({page, settingsOrdersPage}) => {
    await settingsOrdersPage.goto();

    const deliveredResponse = page.waitForResponse((response) => {
        const url = new URL(response.url());
        return (
            response.request().method() === "GET" &&
            url.pathname === "/orders/my-orders" &&
            url.searchParams.getAll("status").includes("DELIVERED")
        );
    });
    await settingsOrdersPage.filterDelivered();
    const response = await deliveredResponse;

    expect(response.ok()).toBeTruthy();
    expect(response.url()).toContain("status=DELIVERED");
});
