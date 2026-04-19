import type {Meta, StoryObj} from "@storybook/react-vite";

import {shippingAddressHandlers} from "@/entities/shipping-address/testing";
import {mockAuthSession} from "@/entities/user/testing";

import {createHandlersScenario} from "@/shared/lib/testing";

import {DisplayShippingAddress} from "./DisplayShippingAddress";

const handlersMap = {
    defaultAddress: shippingAddressHandlers.defaultAddress,
};

const authenticatedState: Partial<StateSchema> = {
    user: {
        currency: "USD",
        userData: mockAuthSession.user,
        accessToken: mockAuthSession.accessToken,
        accessTokenExpiresAt: mockAuthSession.accessTokenExpiresAt,
        isSessionReady: true,
    },
};

const meta = {
    title: "widgets/ManageShippingAddress/DisplayShippingAddress",
    component: DisplayShippingAddress,
    parameters: {
        layout: "centered",
    },
} satisfies Meta<typeof DisplayShippingAddress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    parameters: {
        initialState: authenticatedState,
        msw: {
            handlers: createHandlersScenario("default", handlersMap),
        },
    },
};

export const Loading: Story = {
    parameters: {
        initialState: authenticatedState,
        msw: {
            handlers: createHandlersScenario("loading", handlersMap),
        },
    },
};

export const Fallback: Story = {
    parameters: {
        initialState: authenticatedState,
        msw: {
            handlers: createHandlersScenario("default", handlersMap, {
                defaultAddress: shippingAddressHandlers.defaultAddress.noDefault,
            }),
        },
    },
};
