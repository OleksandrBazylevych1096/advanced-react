import {expect, type BrowserContext, test as base} from "@playwright/test";

import {registerApiMocks} from "../mocks/api/registerApiMocks";
import {createApiScenario, type ApiScenario} from "../mocks/api/scenario";
import {CartPage} from "../page-objects/CartPage";
import {CheckoutPage} from "../page-objects/CheckoutPage";
import {CheckoutResultPage} from "../page-objects/CheckoutResultPage";
import {HomePage} from "../page-objects/HomePage";
import {LoginPage} from "../page-objects/LoginPage";
import {OrderPage} from "../page-objects/OrderPage";
import {SettingsOrdersPage} from "../page-objects/SettingsOrdersPage";

type AuthState = "authenticated" | "guest";
type LoginMode = "success" | "mfa";

interface AppOptions {
    authState: AuthState;
    loginMode: LoginMode;
    refreshSessionFails: boolean;
    paymentSessionFails: boolean;
    missingDefaultAddress: boolean;
    notificationsUpdateFails: boolean;
}

interface AppFixtures {
    scenario: ApiScenario;
    homePage: HomePage;
    cartPage: CartPage;
    checkoutPage: CheckoutPage;
    checkoutResultPage: CheckoutResultPage;
    orderPage: OrderPage;
    loginPage: LoginPage;
    settingsOrdersPage: SettingsOrdersPage;
}

const seedAuthenticatedUser = async (
    context: BrowserContext,
    scenario: ApiScenario,
): Promise<void> => {
    await context.addInitScript(
        ({user}) => {
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.removeItem("guest_cart_v1");
        },
        {user: scenario.authSession.user},
    );
};

export const test = base.extend<AppOptions & AppFixtures>({
    authState: ["authenticated", {option: true}],
    loginMode: ["success", {option: true}],
    refreshSessionFails: [false, {option: true}],
    paymentSessionFails: [false, {option: true}],
    missingDefaultAddress: [false, {option: true}],
    notificationsUpdateFails: [false, {option: true}],

    scenario: [
        async (
            {
                context,
                authState,
                loginMode,
                refreshSessionFails,
                paymentSessionFails,
                missingDefaultAddress,
                notificationsUpdateFails,
            },
            use,
        ) => {
            const scenario = createApiScenario({
                authState,
                loginMode,
                refreshSessionFails,
                paymentSessionFails,
                missingDefaultAddress,
                notificationsUpdateFails,
            });

            if (authState === "authenticated") {
                await seedAuthenticatedUser(context, scenario);
            }
            await registerApiMocks(context, scenario);

            await use(scenario);
        },
        {auto: true},
    ],

    homePage: async ({page}, use) => {
        await use(new HomePage(page));
    },

    cartPage: async ({page}, use) => {
        await use(new CartPage(page));
    },

    checkoutPage: async ({page}, use) => {
        await use(new CheckoutPage(page));
    },

    checkoutResultPage: async ({page}, use) => {
        await use(new CheckoutResultPage(page));
    },

    orderPage: async ({page}, use) => {
        await use(new OrderPage(page));
    },

    loginPage: async ({page}, use) => {
        await use(new LoginPage(page));
    },

    settingsOrdersPage: async ({page}, use) => {
        await use(new SettingsOrdersPage(page));
    },
});

export {expect};
