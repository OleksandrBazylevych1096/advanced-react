import type {Meta, StoryObj} from "@storybook/react-vite";

import {trendingProductsHandlers} from "@/pages/Home/api/trendingProductsApi/test/handlers";
import {firstOrderProductsHandlers} from "@/pages/Home/testing";

import {bestSellingProductsHandlers} from "@/widgets/BestSellingProducts/testing";
import {
    categoryNavigationHandlers,
    topLevelCategoriesHandlers,
} from "@/widgets/CategoryNavigation/testing";
import {promoCarouselHandlers} from "@/widgets/PromoCarousel/testing";

import {productsHandlers} from "@/entities/product/testing";

import {createHandlersScenario} from "@/shared/lib/testing";

import HomePage from "./HomePage";

const homePageHandlersMap = {
    bestSelling: bestSellingProductsHandlers,
    products: productsHandlers,
    categoryNav: categoryNavigationHandlers,
    topLevelCategories: topLevelCategoriesHandlers,
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
