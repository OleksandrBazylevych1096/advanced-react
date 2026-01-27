import type {Meta, StoryObj} from "@storybook/react-vite";


import {trendingProductsHandlers} from "@/widgets/TrendingProducts/lib/test/handlers.ts";

import {productsHandlers} from "@/entities/product/lib/test/handlers.ts";

import {TrendingProducts} from "./TrendingProducts";

const meta: Meta<typeof TrendingProducts> = {
    title: "widgets/TrendingProducts",
    component: TrendingProducts,
    parameters: {
        layout: "fullscreen",
    },
};

export default meta;

type Story = StoryObj<typeof TrendingProducts>;

export const Default: Story = {
    parameters: {
        msw: {
            handlers: [
                trendingProductsHandlers.default,
                productsHandlers.default
            ],
        },
    },
};

export const Loading: Story = {
    parameters: {
        msw: {
            handlers: [
                trendingProductsHandlers.default,
                productsHandlers.loading
            ],
        },
    },
};

export const Error: Story = {
    parameters: {
        msw: {
            handlers: [
                trendingProductsHandlers.default,
                productsHandlers.error
            ],
        },
    },
};
