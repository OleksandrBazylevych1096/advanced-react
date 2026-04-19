import type {Meta, StoryObj} from "@storybook/react-vite";

import {mockProducts} from "@/entities/product/testing";

import {AddToCartButton} from "./AddToCartButton";

const meta = {
    title: "features/add-to-cart/AddToCartButton",
    component: AddToCartButton,
    parameters: {
        layout: "centered",
        initialState: {
            user: {
                currency: "USD",
                userData: undefined,
                isSessionReady: true,
            },
            cart: {
                guestItems: [],
                isInitialized: true,
            },
        } as Partial<StateSchema>,
    },
    args: {
        product: mockProducts[0],
    },
} satisfies Meta<typeof AddToCartButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Compact: Story = {
    args: {
        compact: true,
    },
};

export const OutOfStock: Story = {
    args: {
        product: {
            ...mockProducts[0],
            stock: 0,
        },
    },
};
