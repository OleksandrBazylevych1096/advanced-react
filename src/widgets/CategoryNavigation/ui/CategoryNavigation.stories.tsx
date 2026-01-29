import type {Meta, StoryObj} from '@storybook/react-vite';

import {CategoryNavigation} from "@/widgets/CategoryNavigation";
import {categoryNavigationHandlers} from '@/widgets/CategoryNavigation/api/test/handlers';
import {
    mockCategoryNavigationItems,
    mockElectronicsSubcategories
} from "@/widgets/CategoryNavigation/api/test/mockData.ts";

import {routePaths} from '@/shared/config';
import {createHandlersScenario} from "@/shared/lib/test/msw/createHandlersScenario.ts";


const meta: Meta<typeof CategoryNavigation> = {
    title: 'widgets/CategoryNavigation',
    component: CategoryNavigation,

};

export default meta;
type Story = StoryObj<typeof CategoryNavigation>;

const categoryNavigationHandlersMap = {
    categoryNav: categoryNavigationHandlers
}


export const Default: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario('default', categoryNavigationHandlersMap)
        },
    },
};

export const DefaultActive: Story = {
    parameters: {
        route: `/en/category/${mockCategoryNavigationItems[0].slug}`,
        routePath: routePaths.category,
        msw: {
            handlers: createHandlersScenario('default', categoryNavigationHandlersMap)
        },
    },
};


export const Subcategories: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario('default', categoryNavigationHandlersMap, {categoryNav: categoryNavigationHandlers.subcategories})
        },
    },
};

export const SubcategoriesActive: Story = {
    parameters: {
        route: `/en/category/${mockElectronicsSubcategories[0].slug}`,
        routePath: routePaths.category,
        msw: {
            handlers: createHandlersScenario('default', categoryNavigationHandlersMap, {categoryNav: categoryNavigationHandlers.subcategories})
        },
    },
};


export const Loading: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario('loading', categoryNavigationHandlersMap)
        },
    },
};


export const Error: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario('error', categoryNavigationHandlersMap)
        },
    },
};


export const Empty: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario('default', categoryNavigationHandlersMap, {categoryNav: categoryNavigationHandlers.empty})
        },
    },
};
