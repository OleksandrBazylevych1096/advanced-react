import type {Meta, StoryObj} from "@storybook/react-vite";

import {mockAuthSession} from "@/entities/user/api/test/mockData";

import {createHandlersScenario} from "@/shared/lib/testing";

import {chooseDeliveryDateHandlers} from "../../api/test/handlers";

import {ChooseDeliveryDate} from "./ChooseDeliveryDate";

const handlersMap = {
    defaultAddress: chooseDeliveryDateHandlers.defaultAddress,
    deliverySlots: chooseDeliveryDateHandlers.deliverySlots,
    deliverySelection: chooseDeliveryDateHandlers.deliverySelection,
    setDeliverySlot: chooseDeliveryDateHandlers.setDeliverySlot,
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
    title: "features/choose-delivery-date/ChooseDeliveryDate",
    component: ChooseDeliveryDate,
    parameters: {
        layout: "centered",
    },
    decorators: [
        (Story) => (
            <div style={{width: "680px", padding: "24px", background: "#fff"}}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof ChooseDeliveryDate>;

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

export const Error: Story = {
    parameters: {
        initialState: authenticatedState,
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
            },
        } as Partial<StateSchema>,
    },
};

export const NoSlots: Story = {
    parameters: {
        initialState: authenticatedState,
        msw: {
            handlers: createHandlersScenario("default", handlersMap, {
                deliverySlots: chooseDeliveryDateHandlers.deliverySlots.empty,
            }),
        },
    },
};

export const WithSavedSelection: Story = {
    parameters: {
        initialState: authenticatedState,
        msw: {
            handlers: createHandlersScenario("default", handlersMap, {
                deliverySelection: chooseDeliveryDateHandlers.deliverySelection.default,
            }),
        },
    },
};
