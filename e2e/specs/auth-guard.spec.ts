import {test} from "../fixtures/test";

test.describe("auth guards", () => {
    test.use({authState: "guest"});

    test("redirects guest users from protected settings route to login", async ({
        loginPage,
        page,
    }) => {
        await page.goto("/en/settings/orders");

        await loginPage.expectVisible();
    });
});

test.describe("session refresh", () => {
    test.use({authState: "authenticated", refreshSessionFails: true});

    test("redirects to login when persisted session cannot be refreshed", async ({
        loginPage,
        page,
    }) => {
        await page.goto("/en/settings/orders");

        await loginPage.expectVisible();
    });
});
