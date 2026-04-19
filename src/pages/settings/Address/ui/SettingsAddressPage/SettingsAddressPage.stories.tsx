import type {Meta, StoryObj} from "@storybook/react-vite";

import {saveShippingAddressReducer} from "@/features/save-shipping-address";

import {shippingAddressHandlers} from "@/entities/shipping-address/testing";
import {mockAuthSession} from "@/entities/user/testing";

import {createHandlersScenario} from "@/shared/lib/testing";

import SettingsAddressPage from "./SettingsAddressPage";

const handlersMap = {
    defaultAddress: shippingAddressHandlers.defaultAddress,
    list: shippingAddressHandlers.list,
};

const meta = {
    title: "pages/settings/Address/SettingsAddressPage",
    component: SettingsAddressPage,
    parameters: {
        asyncReducers: {
            saveShippingAddress: saveShippingAddressReducer,
        },
        initialState: {
            user: {
                currency: "USD",
                isSessionReady: true,
                userData: mockAuthSession.user,
                accessToken: mockAuthSession.accessToken,
                accessTokenExpiresAt: mockAuthSession.accessTokenExpiresAt,
            },
            saveShippingAddress: {
                mode: "choose",
                isManageShippingAddressModalOpen: false,
                editingAddressId: undefined,
                location: [51.5074, -0.1278],
                form: {
                    city: "",
                    country: "",
                    numberOfApartment: "",
                    streetAddress: "",
                    zipCode: "",
                },
            },
        } as Partial<StateSchema>,
    },
} satisfies Meta<typeof SettingsAddressPage>;

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

export const Empty: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario("default", handlersMap, {
                list: shippingAddressHandlers.list.empty,
            }),
        },
    },
};
