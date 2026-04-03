import type {Meta, StoryObj} from "@storybook/react-vite";

import {defaultAddressHandlers} from "@/entities/shipping-address/api/test/handlers";
import {mockAuthSession} from "@/entities/user/api/test/mockData";

import {createHandlersScenario} from "@/shared/lib/testing";

import {mockCheckoutSummary} from "../../api/test/mockData";

import {PlaceOrder} from "./PlaceOrder";

const handlersMap = {
    defaultAddress: defaultAddressHandlers,
};

const meta = {
    title: "pages/Checkout/PlaceOrder",
    component: PlaceOrder,
    parameters: {
        initialState: {
            user: {
                currency: "USD",
                userData: mockAuthSession.user,
                accessToken: mockAuthSession.accessToken,
                accessTokenExpiresAt: mockAuthSession.accessTokenExpiresAt,
            },
        } as Partial<StateSchema>,
    },
    decorators: [
        (Story) => (
            <div style={{width: "360px", background: "#fff", padding: "16px"}}>
                <Story />
            </div>
        ),
    ],
    args: {
        summary: mockCheckoutSummary,
        deliverySelection: {
            deliveryDate: "2026-03-22",
            deliveryTime: "12:00",
        },
        tip: 0,
        couponCode: "",
    },
} satisfies Meta<typeof PlaceOrder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario("default", handlersMap),
        },
    },
};

export const DisabledWithoutDeliverySelection: Story = {
    args: {
        deliverySelection: null,
    },
    parameters: {
        msw: {
            handlers: createHandlersScenario("default", handlersMap),
        },
    },
};

export const AddressError: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario("error", handlersMap),
        },
    },
};
