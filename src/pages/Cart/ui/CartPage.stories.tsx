import type {Meta, StoryObj} from "@storybook/react-vite";

import {bestSellingProductsHandlers} from "@/widgets/BestSellingProducts/api/test/handlers";

import {chooseDeliveryDateHandlers} from "@/features/checkout/choose-delivery-date/api/test/handlers";

import {cartHandlers} from "@/entities/cart/api/test/handlers";
import {mockAuthSession} from "@/entities/user/api/test/mockData";

import {createHandlersScenario} from "@/shared/lib/testing";

import CartPage from "./CartPage";

const handlersMap = {
    bestSellingProducts: bestSellingProductsHandlers,
    cart: cartHandlers.cart,
    validation: cartHandlers.validation,
    clearCart: cartHandlers.clearCart,
    updateItem: cartHandlers.updateItem,
    removeItem: cartHandlers.removeItem,
    defaultAddress: chooseDeliveryDateHandlers.defaultAddress,
    deliverySlots: chooseDeliveryDateHandlers.deliverySlots,
    deliverySelection: chooseDeliveryDateHandlers.deliverySelection,
    setDeliverySlot: chooseDeliveryDateHandlers.setDeliverySlot,
};

const meta = {
    title: "pages/CartPage",
    component: CartPage,
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
} satisfies Meta<typeof CartPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario("default", handlersMap),
        },
    },
};

export const Empty: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario("default", handlersMap, {
                cart: cartHandlers.cart.empty,
            }),
        },
    },
};

export const Error: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario("default", handlersMap, {
                cart: cartHandlers.cart.error,
            }),
        },
    },
};
