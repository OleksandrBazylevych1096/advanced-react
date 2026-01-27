import type {Meta, StoryObj} from "@storybook/react-vite";

import {firstOrderProductsHandlers} from "@/pages/Home/lib/test/handlers.ts";

import {bestSellingProductsHandlers} from "@/widgets/BestSellingProducts/lib/test/handlers.ts";
import {categoryNavigationHandlers} from "@/widgets/CategoryNavigation/lib/test/handlers.ts";
import {promoCarouselHandlers} from "@/widgets/PromoCarousel/lib/test/handlers.ts";
import {trendingProductsHandlers} from "@/widgets/TrendingProducts/lib/test/handlers.ts";

import {productsHandlers} from "@/entities/product/lib/test/handlers.ts";

import HomePage from "./HomePage";

const meta = {
    title: "pages/HomePage",
    component: HomePage,
} satisfies Meta<typeof HomePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    parameters: {
        msw: {
            handlers: [
                bestSellingProductsHandlers.default,
                productsHandlers.default,
                categoryNavigationHandlers.default,
                promoCarouselHandlers.default,
                trendingProductsHandlers.default,
                firstOrderProductsHandlers.default
            ],
        }
    }
};

export const Loading: Story = {
    parameters: {
        msw: {
            handlers: [
                bestSellingProductsHandlers.loading,
                productsHandlers.loading,
                categoryNavigationHandlers.loading,
                promoCarouselHandlers.loading,
                trendingProductsHandlers.loading,
                firstOrderProductsHandlers.loading
            ],
        }
    }
};

export const Error: Story = {
    parameters: {
        msw: {
            handlers: [
                bestSellingProductsHandlers.error,
                productsHandlers.error,
                categoryNavigationHandlers.error,
                promoCarouselHandlers.error,
                trendingProductsHandlers.error,
                firstOrderProductsHandlers.error
            ],
        }
    }
};

