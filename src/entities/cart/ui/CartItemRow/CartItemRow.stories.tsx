import type {Meta, StoryObj} from "@storybook/react-vite";

import {mockCart} from "@/entities/cart/testing";

import {CartItemRow} from "./CartItemRow";

const meta = {
    title: "entities/cart/CartItemRow",
    component: CartItemRow,
    parameters: {
        layout: "centered",
    },
    args: {
        item: mockCart.items[0],
        currency: "USD",
    },
} satisfies Meta<typeof CartItemRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Compact: Story = {
    args: {
        compact: true,
    },
};

export const WithValidationIssues: Story = {
    args: {
        validationIssues: ["Only 1 left in stock", "Price updated"],
    },
};
