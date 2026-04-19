import type {Meta, StoryObj} from "@storybook/react-vite";

import {categoryNavigationHandlers} from "@/widgets/CategoryNavigation/testing";
import {promoCarouselHandlers} from "@/widgets/PromoCarousel/testing";

import {productFiltersReducer} from "@/features/product-filters";

import {productsHandlers} from "@/entities/product/testing";

import {AppRoutes, routePaths} from "@/shared/config";
import {createHandlersScenario} from "@/shared/lib/testing";

import SearchPage from "./SearchPage";

const searchPageHandlersMap = {
    products: productsHandlers,
    categoryNav: categoryNavigationHandlers,
    promoCarousel: promoCarouselHandlers,
};

const meta = {
    title: "pages/SearchPage",
    component: SearchPage,
    parameters: {
        asyncReducers: {
            productFilters: productFiltersReducer,
        },
        route: "/en/search",
        routePath: routePaths[AppRoutes.SEARCH],
        initialState: {
            user: {
                currency: "USD",
            },
        } as Partial<StateSchema>,
    },
} satisfies Meta<typeof SearchPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EmptyQuery: Story = {};

export const WithQuery: Story = {
    parameters: {
        route: "/en/search?q=milk",
        msw: {
            handlers: createHandlersScenario("default", searchPageHandlersMap),
        },
    },
};

export const EmptyResults: Story = {
    parameters: {
        route: "/en/search?q=milk",
        msw: {
            handlers: createHandlersScenario("default", searchPageHandlersMap, {
                products: productsHandlers.empty,
            }),
        },
    },
};

export const Loading: Story = {
    parameters: {
        route: "/en/search?q=milk",
        msw: {
            handlers: createHandlersScenario("loading", searchPageHandlersMap),
        },
    },
};

export const Error: Story = {
    parameters: {
        route: "/en/search?q=milk",
        msw: {
            handlers: createHandlersScenario("error", searchPageHandlersMap),
        },
    },
};
