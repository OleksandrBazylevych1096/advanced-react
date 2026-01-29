import type {Meta, StoryObj} from '@storybook/react-vite';

import type {StateSchema} from '@/app/store';


import {breadcrumbsHandlers} from '@/pages/Category/api/test/handlers';

import {categoryNavigationHandlers} from '@/widgets/CategoryNavigation/api/test/handlers';
import {promoCarouselHandlers} from '@/widgets/PromoCarousel/api/test/handlers';

import {productFiltersReducer} from '@/features/productFilters';

import {categoryHandlers} from '@/entities/category/api/test/handlers';
import {productsHandlers} from '@/entities/product/api/test/handlers';

import {routePaths} from '@/shared/config';

import CategoryPage from './CategoryPage';
import {createHandlersScenario} from "@/shared/lib/test/msw/createHandlersScenario.ts";


const categoryPageHandlersMap = {
    breadcrumbs: breadcrumbsHandlers,
    products: productsHandlers,
    category: categoryHandlers,
    categoryNav: categoryNavigationHandlers,
    promoCarousel: promoCarouselHandlers,
};


const meta = {
    title: 'pages/CategoryPage',
    component: CategoryPage,
    parameters: {
        asyncReducers: {
            productFilters: productFiltersReducer,
        },
        route: '/en/category/electronics',
        routePath: routePaths.category,
    },
} satisfies Meta<typeof CategoryPage>;

export default meta;
type Story = StoryObj<typeof meta>;


export const Default: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario('default', categoryPageHandlersMap)
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
                    sortBy: 'price',
                    sortOrder: 'asc',
                },
                isOpen: true,
            },
        } as Partial<StateSchema>,
        msw: {
            handlers: createHandlersScenario('default', categoryPageHandlersMap)
        }
    },
};

export const Loading: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario('loading', categoryPageHandlersMap, {category: categoryHandlers.default})
        },
    },
};


export const Error: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario('error', categoryPageHandlersMap, {category: categoryHandlers.default})
        },
    },
};


