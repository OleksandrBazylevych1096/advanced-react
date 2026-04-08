import type {Meta, StoryObj} from "@storybook/react-vite";

import {CartQuantityStepper} from "./CartQuantityStepper";

const meta = {
    title: "features/update-cart-item-quantity/CartQuantityStepper",
    component: CartQuantityStepper,
    parameters: {layout: "centered"},
    args: {
        productId: "p-1",
        quantity: 2,
        maxQuantity: 8,
    },
} satisfies Meta<typeof CartQuantityStepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const MinReached: Story = {
    args: {
        quantity: 1,
    },
};

export const MaxReached: Story = {
    args: {
        quantity: 8,
    },
};
