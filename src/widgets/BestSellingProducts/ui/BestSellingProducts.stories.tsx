import type {Meta, StoryObj} from '@storybook/react-vite';

import {bestSellingProductsHandlers} from '@/widgets/BestSellingProducts/api/test/handlers';


import {createHandlersScenario} from "@/shared/lib/test/msw/createHandlersScenario.ts";

import {BestSellingProducts} from './BestSellingProducts';

const meta: Meta<typeof BestSellingProducts> = {
    title: 'widgets/BestSellingProducts',
    component: BestSellingProducts,
    parameters: {
        layout: 'fullscreen',
    },
};

export default meta;

type Story = StoryObj<typeof BestSellingProducts>;

const bestSellingProductsHandlersMap = {
    bestSellingProducts: bestSellingProductsHandlers,
}


export const Default: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario('default', bestSellingProductsHandlersMap)
        },
    },
};

export const Loading: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario('loading', bestSellingProductsHandlersMap)
        },
    },
};


export const Error: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario('error', bestSellingProductsHandlersMap)
        },
    },
};
