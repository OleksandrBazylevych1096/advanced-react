import type {Meta, StoryObj} from "@storybook/react-vite";

import {cartHandlers} from "@/entities/cart/api/test/handlers.ts";
import {mockAuthSession} from "@/entities/user/api/test/mockData.ts";

import {createHandlersScenario} from "@/shared/lib/testing";

import {CartPreview} from "./CartPreview.tsx";

const handlersMap = {
    cart: cartHandlers.cart,
    validation: cartHandlers.validation,
    updateItem: cartHandlers.updateItem,
    removeItem: cartHandlers.removeItem,
};

const meta = {
    title: "widgets/Header/CartPreview",
    component: CartPreview,
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
    decorators: [
        (Story) => (
            <div style={{padding: "24px", width: "420px"}}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof CartPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario("default", handlersMap),
        },
    },
};

export const WithIssues: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario("default", handlersMap, {
                validation: cartHandlers.validation.withIssues,
            }),
        },
    },
};
