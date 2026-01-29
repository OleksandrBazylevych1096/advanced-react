import type {Meta, StoryObj} from '@storybook/react-vite';

import {promoCarouselHandlers} from '@/widgets/PromoCarousel/api/test/handlers';


import {PromoCarousel} from './PromoCarousel';
import {createHandlersScenario} from "@/shared/lib/test/msw/createHandlersScenario.ts";

const meta: Meta<typeof PromoCarousel> = {
    title: 'widgets/PromoCarousel',
    component: PromoCarousel,
    parameters: {
        layout: 'fullscreen',
    },
};

export default meta;

type Story = StoryObj<typeof PromoCarousel>;

const promoCarouselHandlersMap = {
    promoCarousel: promoCarouselHandlers
}


export const Default: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario('default', promoCarouselHandlersMap)
        },
    },
};


export const Loading: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario('loading', promoCarouselHandlersMap)
        },
    },
};


export const Error: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario('error', promoCarouselHandlersMap)
        },
    },
};
