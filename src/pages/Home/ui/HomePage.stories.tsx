import type {Meta, StoryObj} from "@storybook/react-vite";

import {firstOrderProductsHandlers} from "@/pages/Home/api/test/handlers";

import {bestSellingProductsHandlers} from "@/widgets/BestSellingProducts";
import {categoryNavigationHandlers} from "@/widgets/CategoryNavigation";
import {promoCarouselHandlers} from "@/widgets/PromoCarousel";
import {trendingProductsHandlers} from "@/widgets/TrendingProducts";

import {productsHandlers} from "@/entities/product";

import {createHandlersScenario} from "@/shared/lib/testing/msw/createHandlersScenario.ts";

import HomePage from "./HomePage";

const homePageHandlersMap = {
    bestSelling: bestSellingProductsHandlers,
    products: productsHandlers,
    categoryNav: categoryNavigationHandlers,
    promoCarousel: promoCarouselHandlers,
    trending: trendingProductsHandlers,
    firstOrder: firstOrderProductsHandlers,
};

const meta = {
    title: "pages/HomePage",
    component: HomePage,
} satisfies Meta<typeof HomePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario("default", homePageHandlersMap),
        },
    },
};

export const Loading: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario("loading", homePageHandlersMap),
        },
    },
};

export const Error: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario("error", homePageHandlersMap),
        },
    },
};
