import type {Meta, StoryObj} from "@storybook/react-vite";

import {checkoutResultHandlers} from "@/pages/CheckoutResult/api/test/handlers";

import {createHandlersScenario} from "@/shared/lib/testing";

import CheckoutResultPage from "./CheckoutResultPage";

const handlersMap = {
    checkoutSession: checkoutResultHandlers.checkoutSession,
    confirmFallback: checkoutResultHandlers.confirmFallback,
};

const meta = {
    title: "pages/CheckoutResultPage",
    component: CheckoutResultPage,
    parameters: {
        routePath: "/:lng/checkout/result",
        initialState: {
            user: {
                currency: "USD",
            },
            cart: {
                guestItems: [],
                isInitialized: true,
            },
        } as Partial<StateSchema>,
    },
} satisfies Meta<typeof CheckoutResultPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MissingSessionId: Story = {
    parameters: {
        route: "/en/checkout/result",
    },
};

export const Pending: Story = {
    parameters: {
        route: "/en/checkout/result?sessionId=sess_123",
        msw: {
            handlers: createHandlersScenario("default", handlersMap, {
                checkoutSession: checkoutResultHandlers.checkoutSession.pending,
            }),
        },
    },
};

export const Paid: Story = {
    parameters: {
        route: "/en/checkout/result?sessionId=sess_123",
        msw: {
            handlers: createHandlersScenario("default", handlersMap, {
                checkoutSession: checkoutResultHandlers.checkoutSession.paid,
            }),
        },
    },
};

export const Failed: Story = {
    parameters: {
        route: "/en/checkout/result?sessionId=sess_123",
        msw: {
            handlers: createHandlersScenario("default", handlersMap, {
                checkoutSession: checkoutResultHandlers.checkoutSession.failed,
            }),
        },
    },
};

export const SystemError: Story = {
    parameters: {
        route: "/en/checkout/result?sessionId=sess_123",
        msw: {
            handlers: createHandlersScenario("error", handlersMap),
        },
    },
};
