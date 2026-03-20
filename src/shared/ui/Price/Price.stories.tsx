import type {Meta, StoryObj} from "@storybook/react-vite";

import {Price} from "./Price";

const meta: Meta<typeof Price> = {
    title: "shared/Price",
    component: Price,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: {
        language: "en",
        currency: "USD",
        size: "l",
    },
};

export default meta;
type Story = StoryObj<typeof Price>;

export const Default: Story = {
    args: {
        price: 99.99,
    },
};

export const WithDiscount: Story = {
    args: {
        price: 79.99,
        oldPrice: 99.99,
    },
};

export const SizeXL: Story = {
    args: {
        price: 1299.99,
        oldPrice: 1499.99,
        size: "xl",
    },
};

export const SizeM: Story = {
    args: {
        price: 39.99,
        size: "m",
    },
};

export const SizeS: Story = {
    args: {
        price: 9.99,
        oldPrice: 12.99,
        size: "s",
    },
};

export const EuroCurrency: Story = {
    args: {
        price: 89.99,
        oldPrice: 119.99,
        language: "de",
        currency: "EUR",
    },
};
