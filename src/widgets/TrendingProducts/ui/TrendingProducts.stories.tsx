import type {Meta, StoryObj} from "@storybook/react-vite";

import {trendingProductsHandlers} from "@/widgets/TrendingProducts";

import {productsHandlers} from "@/entities/product";

import {createHandlersScenario} from "@/shared/libScenario.ts";

import {TrendingProducts} from "./TrendingProducts";

const meta: Meta<typeof TrendingProducts> = {
    title: "widgets/TrendingProducts",
    component: TrendingProducts,
    parameters: {
        layout: "fullscreen",
    },
};

const trendingProductsHandlersMap = {
    products: productsHandlers,
    trending: trendingProductsHandlers,
};

export default meta;

type Story = StoryObj<typeof TrendingProducts>;

export const Default: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario("default", trendingProductsHandlersMap),
        },
    },
};

export const Loading: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario("loading", trendingProductsHandlersMap, {
                products: productsHandlers.default,
            }),
        },
    },
};

export const Error: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario("error", trendingProductsHandlersMap, {
                products: productsHandlers.default,
            }),
        },
    },
};
