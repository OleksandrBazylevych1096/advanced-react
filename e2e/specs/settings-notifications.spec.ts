import {expect, test} from "../fixtures/test";

test("updates email notification preference after a successful toggle", async ({
    homePage,
    page,
}) => {
    await homePage.goto();
    await page.goto("/en/settings/notifications");

    const checkbox = page.getByTestId("email-notifications-checkbox");

    await expect(checkbox).toBeChecked();
    await checkbox.uncheck({force: true});

    await expect(checkbox).not.toBeChecked();
    await expect(page.getByTestId("toast-notification-success")).toBeVisible();
});

test.describe("notifications rollback", () => {
    test.use({notificationsUpdateFails: true});

    test("restores the previous checkbox value when update fails", async ({homePage, page}) => {
        await homePage.goto();
        await page.goto("/en/settings/notifications");

        const checkbox = page.getByTestId("email-notifications-checkbox");

        await expect(checkbox).toBeChecked();
        await checkbox.uncheck({force: true});

        await expect(checkbox).toBeChecked();
        await expect(page.getByTestId("toast-notification-error")).toBeVisible();
    });
});
