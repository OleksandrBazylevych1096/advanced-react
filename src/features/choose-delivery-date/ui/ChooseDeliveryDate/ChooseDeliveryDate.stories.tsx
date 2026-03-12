import type {Meta, StoryObj} from "@storybook/react-vite";

import {createHandlersScenario} from "@/shared/lib/testing/msw/createHandlersScenario";

import {chooseDeliveryDateHandlers} from "../../api/test/handlers";

import {ChooseDeliveryDate} from "./ChooseDeliveryDate";

const handlersMap = {
    defaultAddress: chooseDeliveryDateHandlers.defaultAddress,
    deliverySlots: chooseDeliveryDateHandlers.deliverySlots,
    deliverySelection: chooseDeliveryDateHandlers.deliverySelection,
    setDeliverySlot: chooseDeliveryDateHandlers.setDeliverySlot,
};

const meta = {
    title: "features/ChooseDeliveryDate",
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
        initialState: {
            user: {
                userData: {
                    id: "u1",
                    email: "user@example.com",
                    isVerified: true,
                },
            },
        },
        msw: {
            handlers: createHandlersScenario("default", handlersMap),
        },
    },
};

export const Loading: Story = {
    parameters: {
        initialState: {
            user: {
                userData: {
                    id: "u1",
                    email: "user@example.com",
                    isVerified: true,
                },
            },
        },
        msw: {
            handlers: createHandlersScenario("loading", handlersMap),
        },
    },
};

export const Error: Story = {
    parameters: {
        initialState: {
            user: {
                userData: {
                    id: "u1",
                    email: "user@example.com",
                    isVerified: true,
                },
            },
        },
        msw: {
            handlers: createHandlersScenario("error", handlersMap),
        },
    },
};

export const Guest: Story = {
    parameters: {
        initialState: {
            user: {
                userData: undefined,
            },
        },
    },
};

export const NoSlots: Story = {
    parameters: {
        initialState: {
            user: {
                userData: {
                    id: "u1",
                    email: "user@example.com",
                    isVerified: true,
                },
            },
        },
        msw: {
            handlers: createHandlersScenario("default", handlersMap, {
                deliverySlots: chooseDeliveryDateHandlers.deliverySlots.empty,
            }),
        },
    },
};
