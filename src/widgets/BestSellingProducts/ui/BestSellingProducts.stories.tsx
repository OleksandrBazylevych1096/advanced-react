import type {Meta, StoryObj} from "@storybook/react-vite";

import {bestSellingProductsHandlers} from "@/widgets/BestSellingProducts/lib/test/handlers.ts";

import {BestSellingProducts} from "./BestSellingProducts";

const meta: Meta<typeof BestSellingProducts> = {
    title: "widgets/BestSellingProducts",
    component: BestSellingProducts,
    parameters: {
        layout: "fullscreen",
    },
};

export default meta;

type Story = StoryObj<typeof BestSellingProducts>;

export const Default: Story = {
    parameters: {
        msw: {
            handlers: [
                bestSellingProductsHandlers.default,
            ],
        },
    },
};

export const Loading: Story = {
    parameters: {
        msw: {
            handlers: [
                bestSellingProductsHandlers.loading,
            ],
        },
    },
};

export const Error: Story = {
    parameters: {
        msw: {
            handlers: [
                bestSellingProductsHandlers.error,
            ],
        },
    },
};
