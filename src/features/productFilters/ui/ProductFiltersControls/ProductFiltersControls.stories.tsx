import type {Meta, StoryObj} from '@storybook/react-vite';


import type {StateSchema} from "@/app/store";

import {productFiltersReducer} from "@/features/productFilters";

import {ProductFiltersControls} from './ProductFiltersControls';

const meta: Meta<typeof ProductFiltersControls> = {
    title: 'features/productFilters/ProductFiltersControls',
    component: ProductFiltersControls,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
        asyncReducers: {
            productFilters: productFiltersReducer,
        },
    },
};

export default meta;
type Story = StoryObj<typeof ProductFiltersControls>;

export const Default: Story = {
    parameters: {
        initialState: {
            productFilters: {
                filters: {
                    sortBy: 'name',
                    sortOrder: 'asc'
                }
            },
        } as Partial<StateSchema>,
    },
};

export const SortByPrice: Story = {
    parameters: {
        initialState: {
            productFilters: {
                filters: {
                    sortBy: 'price',
                    sortOrder: 'asc'
                }
            },
        } as Partial<StateSchema>,
    },
};

export const SortByRating: Story = {
    parameters: {
        initialState: {
            productFilters: {
                filters: {
                    sortBy: 'rating',
                    sortOrder: 'asc'
                }
            },
        } as Partial<StateSchema>,
    },
};

export const SortOrderDesc: Story = {
    parameters: {
        initialState: {
            productFilters: {
                filters: {
                    sortBy: 'name',
                    sortOrder: 'desc'
                }
            },
        } as Partial<StateSchema>,
    },
};