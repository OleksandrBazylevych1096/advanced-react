import type {Meta, StoryObj} from "@storybook/react-vite";

import {chooseDeliveryDateHandlers} from "@/features/checkout/choose-delivery-date/api/test/handlers";

import {mockSingleAddress} from "@/entities/shipping-address/api/test/mockData";
import {mockAuthSession} from "@/entities/user/api/test/mockData";

import {createHandlersScenario} from "@/shared/lib/testing";

import {CheckoutDeliveryInfoCard} from "./CheckoutDeliveryInfoCard";

const handlersMap = {
    defaultAddress: chooseDeliveryDateHandlers.defaultAddress,
    deliverySlots: chooseDeliveryDateHandlers.deliverySlots,
    deliverySelection: chooseDeliveryDateHandlers.deliverySelection,
    setDeliverySlot: chooseDeliveryDateHandlers.setDeliverySlot,
};

const meta = {
    title: "pages/CheckoutPage/CheckoutDeliveryInfoCard",
    component: CheckoutDeliveryInfoCard,
    parameters: {
        layout: "centered",
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
            <div style={{width: "760px"}}>
                <Story />
            </div>
        ),
    ],
    args: {
        address: mockSingleAddress,
        onOpenManageShippingAddressModal: () => undefined,
    },
} satisfies Meta<typeof CheckoutDeliveryInfoCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithAddress: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario("default", handlersMap),
        },
    },
};

export const WithoutAddress: Story = {
    args: {
        address: undefined,
    },
    parameters: {
        msw: {
            handlers: createHandlersScenario("default", handlersMap, {
                defaultAddress: chooseDeliveryDateHandlers.defaultAddress.none,
            }),
        },
    },
};
