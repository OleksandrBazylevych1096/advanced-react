import type {Meta, StoryObj} from "@storybook/react-vite";

import {cartHandlers} from "@/entities/cart/testing";

import {createHandlersScenario} from "@/shared/lib/testing";

import {ClearCartButton} from "./ClearCartButton";

const meta = {
    title: "pages/Cart/ClearCartButton",
    component: ClearCartButton,
    parameters: {layout: "centered"},
} satisfies Meta<typeof ClearCartButton>;

const handlersMap = {
    clearCart: cartHandlers.clearCart,
};
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
