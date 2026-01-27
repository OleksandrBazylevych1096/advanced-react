import type {Meta, StoryObj} from '@storybook/react-vite';

import {productFiltersReducer} from "@/features/productFilters";

import {categoryHandlers} from "@/entities/category/lib/test/handlers.ts";
import {productsHandlers} from "@/entities/product/lib/test/handlers.ts";

import {ProductFilters} from './ProductFilters';


const defaultInitialState = {
    productFilters: {
        filters: {
            priceRange: {min: undefined, max: undefined},
            countries: [],
            brands: [],
            inStock: false,
            sortBy: 'price',
            sortOrder: 'asc',
        },
        isOpen: true,
    },
    user: {
        currency: 'USD',
    },
};

const meta: Meta<typeof ProductFilters> = {
    title: 'features/productFilters/ProductFilters',
    component: ProductFilters,
    args: {
        defaultOpenFilters: ['price', 'brands', 'countries'],
    },
    parameters: {
        layout: 'fullscreen',
        asyncReducers: {
            productFilters: productFiltersReducer
        },
        initialState: defaultInitialState,
        msw: {
            handlers: [
                categoryHandlers.default,
                productsHandlers.default,
            ],
        },
    },
};

export default meta;
type Story = StoryObj<typeof ProductFilters>;

export const Default: Story = {};

export const WithSelectedFilters: Story = {
    parameters: {
        initialState: {
            productFilters: {
                filters: {
                    priceRange: {min: 200, max: 3000},
                    countries: ['USA', 'Germany'],
                    brands: ['apple', 'samsung'],
                    inStock: true,
                    sortBy: 'price',
                    sortOrder: 'asc',
                },
                isOpen: true,
            },
            user: {
                currency: 'USD',
            },
        },
        msw: {
            handlers: [
                categoryHandlers.default,
                productsHandlers.withFilters,
            ],
        },
    },
};

export const Loading: Story = {
    parameters: {
        msw: {
            handlers: [
                categoryHandlers.loading,
                productsHandlers.loading,
            ],
        },
    },
};

export const Error: Story = {
    parameters: {
        msw: {
            handlers: [
                categoryHandlers.error,
                productsHandlers.error,
            ],
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
                    sortBy: 'price',
                    sortOrder: 'asc',
                },
                isOpen: true,
            },
            user: {
                currency: 'EUR',
            },
        },
        msw: {
            handlers: [
                categoryHandlers.default,
                productsHandlers.withEuroCurrency,
            ],
        },
    },
};

export const EmptyFacets: Story = {
    parameters: {
        msw: {
            handlers: [
                categoryHandlers.default,
                productsHandlers.empty,
            ],
        },
    },
};