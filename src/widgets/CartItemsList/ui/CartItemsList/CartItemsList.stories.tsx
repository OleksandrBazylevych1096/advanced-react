import type {Meta, StoryObj} from "@storybook/react-vite";

import {cartHandlers} from "@/entities/cart/testing";
import {mockAuthSession} from "@/entities/user/testing";

import {createHandlersScenario} from "@/shared/lib/testing";

import {CartItemsList} from "./CartItemsList.tsx";

const handlersMap = {
    cart: cartHandlers.cart,
    validation: cartHandlers.validation,
    updateItem: cartHandlers.updateItem,
    removeItem: cartHandlers.removeItem,
};

const meta = {
    title: "widgets/Cart/CartItemsList",
    component: CartItemsList,
    parameters: {
        initialState: {
            user: {
                currency: "USD",
                userData: mockAuthSession.user,
                accessToken: mockAuthSession.accessToken,
                accessTokenExpiresAt: mockAuthSession.accessTokenExpiresAt,
                isSessionReady: true,
            },
            cart: {
                guestItems: [],
                isInitialized: true,
            },
        } as Partial<StateSchema>,
    },
} satisfies Meta<typeof CartItemsList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario("default", handlersMap),
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
