import type {Meta, StoryObj} from "@storybook/react-vite";

import {saveShippingAddressReducer} from "@/features/shipping-address/save";

import {shippingAddressHandlers} from "@/entities/shipping-address/api/test/handlers";
import {mockAuthSession} from "@/entities/user/api/test/mockData";

import {createHandlersScenario} from "@/shared/libScenario";

import {ManageShippingAddress} from "./ManageShippingAddress";

const handlersMap = {
    defaultAddress: shippingAddressHandlers.defaultAddress,
    list: shippingAddressHandlers.list,
};

const meta = {
    title: "widgets/ManageShippingAddress/ManageShippingAddress",
    component: ManageShippingAddress,
    parameters: {
        asyncReducers: {
            saveShippingAddress: saveShippingAddressReducer,
        },
        initialState: {
            user: {
                currency: "USD",
            },
            saveShippingAddress: {
                mode: "choose",
                isManageShippingAddressModalOpen: true,
                editingAddressId: undefined,
                location: [51.5074, -0.1278],
                form: {
                    city: "",
                    numberOfApartment: "",
                    streetAddress: "",
                    zipCode: "",
                },
            },
        } as Partial<StateSchema>,
    },
} satisfies Meta<typeof ManageShippingAddress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    parameters: {
        initialState: {
            user: {
                currency: "USD",
                userData: mockAuthSession.user,
                accessToken: mockAuthSession.accessToken,
                accessTokenExpiresAt: mockAuthSession.accessTokenExpiresAt,
            },
        } as Partial<StateSchema>,
        msw: {
            handlers: createHandlersScenario("default", handlersMap),
        },
    },
};

export const Loading: Story = {
    parameters: {
        initialState: {
            user: {
                currency: "USD",
                userData: mockAuthSession.user,
                accessToken: mockAuthSession.accessToken,
                accessTokenExpiresAt: mockAuthSession.accessTokenExpiresAt,
            },
        } as Partial<StateSchema>,
        msw: {
            handlers: createHandlersScenario("loading", handlersMap),
        },
    },
};

export const Error: Story = {
    parameters: {
        initialState: {
            user: {
                currency: "USD",
                userData: mockAuthSession.user,
                accessToken: mockAuthSession.accessToken,
                accessTokenExpiresAt: mockAuthSession.accessTokenExpiresAt,
            },
        } as Partial<StateSchema>,
        msw: {
            handlers: createHandlersScenario("error", handlersMap),
        },
    },
};

export const Guest: Story = {
    parameters: {
        initialState: {
            user: {
                currency: "USD",
                userData: undefined,
                accessToken: undefined,
                accessTokenExpiresAt: undefined,
            },
            saveShippingAddress: {
                mode: "choose",
                isManageShippingAddressModalOpen: true,
                editingAddressId: undefined,
                location: [51.5074, -0.1278],
                form: {
                    city: "",
                    numberOfApartment: "",
                    streetAddress: "",
                    zipCode: "",
                },
            },
        } as Partial<StateSchema>,
        msw: {
            handlers: createHandlersScenario("default", handlersMap),
        },
    },
};
