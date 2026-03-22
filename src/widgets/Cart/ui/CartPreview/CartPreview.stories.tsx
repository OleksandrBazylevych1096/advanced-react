import type {Meta, StoryObj} from "@storybook/react-vite";

import {cartHandlers} from "@/entities/cart/api/test/handlers";
import {mockAuthSession} from "@/entities/user/api/test/mockData";

import {createHandlersScenario} from "@/shared/libScenario";

import {CartPreview} from "./CartPreview";

const handlersMap = {
    cart: cartHandlers.cart,
    validation: cartHandlers.validation,
    updateItem: cartHandlers.updateItem,
    removeItem: cartHandlers.removeItem,
};

const meta = {
    title: "widgets/Cart/CartPreview",
    component: CartPreview,
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
