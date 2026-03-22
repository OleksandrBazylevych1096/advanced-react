import type {Meta, StoryObj} from "@storybook/react-vite";

import {applyCouponHandlers} from "@/features/checkout/apply-coupon/api/test/handlers";
import {chooseDeliveryDateHandlers} from "@/features/checkout/choose-delivery-date/api/test/handlers";
import {placeOrderHandlers} from "@/features/checkout/place-order/api/test/handlers";

import {shippingAddressHandlers} from "@/entities/shipping-address/api/test/handlers";
import {mockAuthSession} from "@/entities/user/api/test/mockData";

import {createHandlersScenario} from "@/shared/libScenario";

import CheckoutPage from "./CheckoutPage";

const handlersMap = {
    checkoutSummary: placeOrderHandlers.checkoutSummary,
    createPaymentSession: placeOrderHandlers.createPaymentSession,
    defaultAddress: shippingAddressHandlers.defaultAddress,
    deliverySlots: chooseDeliveryDateHandlers.deliverySlots,
    deliverySelection: chooseDeliveryDateHandlers.deliverySelection,
    setDeliverySlot: chooseDeliveryDateHandlers.setDeliverySlot,
    validateCoupon: applyCouponHandlers.validateCoupon,
};

const meta = {
    title: "pages/CheckoutPage",
    component: CheckoutPage,
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
        route: "/en/checkout",
        routePath: "/:lng/checkout",
    },
} satisfies Meta<typeof CheckoutPage>;

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

export const SummaryError: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario("default", handlersMap, {
                checkoutSummary: placeOrderHandlers.checkoutSummary.error,
            }),
        },
    },
};
