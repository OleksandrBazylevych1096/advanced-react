import type {Meta, StoryObj} from "@storybook/react-vite";

import {productFiltersReducer} from "@/features/product-filters";

import {categoryHandlers, mockCategories} from "@/entities/category/testing";
import {
    productsHandlers,
    mockProductBrands,
    mockProductCountries,
} from "@/entities/product/testing";

import {createHandlersScenario} from "@/shared/lib/testing";

import {ProductFilters} from "./ProductFilters";

const defaultInitialState = {
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
    user: {
        currency: "USD",
    },
};

const meta: Meta<typeof ProductFilters> = {
    title: "features/product-filters/ProductFilters",
    component: ProductFilters,
    args: {
        defaultOpenFilters: ["price", "brands", "countries"],
        categoryId: mockCategories[0].id,
    },
    parameters: {
        layout: "fullscreen",
        asyncReducers: {
            productFilters: productFiltersReducer,
        },
        initialState: defaultInitialState,
    },
};

export default meta;
type Story = StoryObj<typeof ProductFilters>;

const productFiltersHandlers = {
    products: productsHandlers,
    category: categoryHandlers,
};

export const Default: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario("default", productFiltersHandlers),
        },
    },
};

export const WithSelectedFilters: Story = {
    parameters: {
        initialState: {
            productFilters: {
                filters: {
                    priceRange: {min: 200, max: 3000},
                    countries: mockProductCountries.slice(0, 2),
                    brands: mockProductBrands.slice(0, 2),
                    inStock: true,
                    sortBy: "price",
                    sortOrder: "asc",
                },
                isOpen: true,
            },
            user: {
                currency: "USD",
            },
        },
        msw: {
            handlers: createHandlersScenario("default", productFiltersHandlers),
        },
    },
};

export const Loading: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario("loading", productFiltersHandlers),
        },
    },
};

export const Error: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario("error", productFiltersHandlers),
        },
    },
};

export const WithEuroCurrency: Story = {
    parameters: {
        initialState: {
            productFilters: {
                filters: {
                    priceRange: {min: 150, max: 2500},
                    countries: [],
                    brands: [],
                    inStock: false,
                    sortBy: "price",
                    sortOrder: "asc",
                },
                isOpen: true,
            },
            user: {
                currency: "EUR",
            },
        },
        msw: {
            handlers: createHandlersScenario("default", productFiltersHandlers, {
                products: productsHandlers.withEuroCurrency,
            }),
        },
    },
};

export const EmptyFacets: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario("default", productFiltersHandlers, {
                products: productsHandlers.empty,
            }),
        },
    },
};
