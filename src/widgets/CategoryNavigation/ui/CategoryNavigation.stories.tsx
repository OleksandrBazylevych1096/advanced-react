import type {Meta, StoryObj} from '@storybook/react-vite';

import {categoryNavigationHandlers} from "@/widgets/CategoryNavigation/lib/test/handlers.ts";

import {mockCategories} from "@/entities/category/lib/test/mockData.ts";

import {routePaths} from "@/shared/config";

import {CategoryNavigation} from './CategoryNavigation';


const meta: Meta<typeof CategoryNavigation> = {
    title: 'widgets/CategoryNavigation',
    component: CategoryNavigation,
    parameters: {
        route: `/en/category/${mockCategories[0].slug}`,
        routePath: routePaths.category,
        layout: 'padded',

    }
};

export default meta;
type Story = StoryObj<typeof CategoryNavigation>;

export const Default: Story = {
    parameters: {
        msw: {
            handlers: [categoryNavigationHandlers.default],
        },
    }
};

export const Subcategories: Story = {
    parameters: {
        msw: {
            handlers: [categoryNavigationHandlers.subcategories],
        },
    },
};


export const Loading: Story = {
    parameters: {
        msw: {
            handlers: [categoryNavigationHandlers.loading],
        },
    },
};

export const Error: Story = {
    parameters: {
        msw: {
            handlers: [categoryNavigationHandlers.error],
        },
    },
};

