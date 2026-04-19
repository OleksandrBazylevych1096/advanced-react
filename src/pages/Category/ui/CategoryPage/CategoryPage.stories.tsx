import type {Meta, StoryObj} from "@storybook/react-vite";

import {categoryNavigationHandlers} from "@/widgets/CategoryNavigation/testing";
import {promoCarouselHandlers} from "@/widgets/PromoCarousel/testing";

import {productFiltersReducer} from "@/features/product-filters";

import {categoryBreadcrumbsHandlers, categoryHandlers} from "@/entities/category/testing";
import {productsHandlers} from "@/entities/product/testing";

import {AppRoutes, routePaths} from "@/shared/config";
import {createHandlersScenario} from "@/shared/lib/testing";

import CategoryPage from "./CategoryPage";

const categoryPageHandlersMap = {
    breadcrumbs: categoryBreadcrumbsHandlers,
    products: productsHandlers,
    category: categoryHandlers,
    categoryNav: categoryNavigationHandlers,
    promoCarousel: promoCarouselHandlers,
};

const meta = {
    title: "pages/CategoryPage",
    component: CategoryPage,
    parameters: {
        asyncReducers: {
            productFilters: productFiltersReducer,
        },
        route: "/en/category/electronics",
        routePath: routePaths[AppRoutes.CATEGORY],
    },
} satisfies Meta<typeof CategoryPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario("default", categoryPageHandlersMap),
        },
    },
};

export const FiltersOpen: Story = {
    parameters: {
        initialState: {
            productFilters: {
                filters: {
                    priceRange: {min: undefined, max: undefined},
                    countries: [],
                    brands: [],
                    inStock: false,
                    sortBy: "price",
                    sortOrder: "asc",
                },
                isOpen: true,
            },
        } as Partial<StateSchema>,
        msw: {
            handlers: createHandlersScenario("default", categoryPageHandlersMap),
        },
    },
};

export const Loading: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario("loading", categoryPageHandlersMap, {
                category: categoryHandlers.default,
            }),
        },
    },
};

export const Error: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario("error", categoryPageHandlersMap, {
                category: categoryHandlers.default,
            }),
        },
    },
};
