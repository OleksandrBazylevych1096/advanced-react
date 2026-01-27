import type {Meta, StoryObj} from "@storybook/react-vite";


import {promoCarouselHandlers} from "@/widgets/PromoCarousel/lib/test/handlers.ts";

import {PromoCarousel} from "./PromoCarousel";

const meta: Meta<typeof PromoCarousel> = {
    title: "widgets/PromoCarousel",
    component: PromoCarousel,
    parameters: {
        layout: "fullscreen",
    },
};

export default meta;

type Story = StoryObj<typeof PromoCarousel>;

export const Default: Story = {
    parameters: {
        msw: {
            handlers: [
                promoCarouselHandlers.default
            ],
        },
    },
};

export const Loading: Story = {
    parameters: {
        msw: {
            handlers: [
                promoCarouselHandlers.loading
            ],
        },
    },
};

export const Error: Story = {
    parameters: {
        msw: {
            handlers: [
                promoCarouselHandlers.error
            ],
        },
    },
};
