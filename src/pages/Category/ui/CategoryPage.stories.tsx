import type {Meta, StoryObj} from "@storybook/react-vite";

import type {StateSchema} from "@/app/store";

import {breadcrumbsHandlers} from "@/pages/Category/lib/test/handlers.ts";

import {categoryNavigationHandlers} from "@/widgets/CategoryNavigation/lib/test/handlers.ts";
import {promoCarouselHandlers} from "@/widgets/PromoCarousel/lib/test/handlers.ts";

import {productFiltersReducer} from "@/features/productFilters";

import {categoryHandlers} from "@/entities/category/lib/test/handlers.ts";
import {productsHandlers} from "@/entities/product/lib/test/handlers.ts";

import {routePaths} from "@/shared/config";

import CategoryPage from "./CategoryPage";

const meta = {
    title: "pages/CategoryPage",
    component: CategoryPage,
    parameters: {
        asyncReducers: {
            productFilters: productFiltersReducer
        },
        route: '/en/category/electronics',
        routePath: routePaths.category
    }
} satisfies Meta<typeof CategoryPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    parameters: {
        msw: {
            handlers: [
                breadcrumbsHandlers.default,
                productsHandlers.default,
                categoryHandlers.default,
                categoryNavigationHandlers.default,
                promoCarouselHandlers.default,
            ],
        }
    }
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
                    sortBy: 'price',
                    sortOrder: 'asc',
                },
                isOpen: true
            }
        } as Partial<StateSchema>,
        msw: {
            handlers: [
                breadcrumbsHandlers.default,
                productsHandlers.default,
                categoryHandlers.default,
                categoryNavigationHandlers.default,
                promoCarouselHandlers.default,
            ],
        }
    }
};


export const Loading: Story = {
    parameters: {
        msw: {
            handlers: [
                breadcrumbsHandlers.loading,
                productsHandlers.loading,
                categoryHandlers.default,
                categoryNavigationHandlers.loading,
                promoCarouselHandlers.loading,
            ],
        }
    }
};

export const Error: Story = {
    parameters: {
        msw: {
            handlers: [
                breadcrumbsHandlers.error,
                categoryHandlers.default,
                productsHandlers.error,
                categoryNavigationHandlers.error,
                promoCarouselHandlers.error,
            ],
        }
    }
};

