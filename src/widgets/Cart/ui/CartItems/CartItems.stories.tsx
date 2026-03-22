import type {Meta, StoryObj} from "@storybook/react-vite";

import {cartHandlers} from "@/entities/cart/api/test/handlers";
import {mockAuthSession} from "@/entities/user/api/test/mockData";

import {createHandlersScenario} from "@/shared/libScenario";

import {CartItems} from "./CartItems";

const handlersMap = {
    cart: cartHandlers.cart,
    validation: cartHandlers.validation,
    updateItem: cartHandlers.updateItem,
    removeItem: cartHandlers.removeItem,
};

const meta = {
    title: "widgets/Cart/CartItems",
    component: CartItems,
    parameters: {
        initialState: {
            user: {
                currency: "USD",
                userData: mockAuthSession.user,
                accessToken: mockAuthSession.accessToken,
                accessTokenExpiresAt: mockAuthSession.accessTokenExpiresAt,
            },
            cart: {
                guestItems: [],
                isInitialized: true,
            },
        } as Partial<StateSchema>,
    },
} satisfies Meta<typeof CartItems>;

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

