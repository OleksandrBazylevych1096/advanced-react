import type {Meta, StoryObj} from "@storybook/react-vite";

import {orderHandlers} from "@/entities/order/api/test/handlers";

import {createHandlersScenario} from "@/shared/lib/testing";

import OrderPage from "./OrderPage";

const handlersMap = {
    order: orderHandlers.getOrderById,
};

const meta = {
    title: "pages/OrderPage",
    component: OrderPage,
    parameters: {
        route: "/en/order/order-1",
        routePath: "/:lng/order/:id",
        initialState: {
            user: {
                currency: "USD",
                isSessionReady: true,
            },
            cart: {
                guestItems: [],
                isInitialized: true,
            },
        } as Partial<StateSchema>,
    },
} satisfies Meta<typeof OrderPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InProgress: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario("default", handlersMap),
        },
    },
};

export const Delivered: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario("default", handlersMap, {
                order: orderHandlers.getOrderById.delivered,
            }),
        },
    },
};

export const Loading: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario("loading", handlersMap),
        },
    },
};

export const Error: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario("error", handlersMap),
        },
    },
};
