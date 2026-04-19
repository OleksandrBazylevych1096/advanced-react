import type {Meta, StoryObj} from "@storybook/react-vite";

import {CategoryNavigation} from "@/widgets/CategoryNavigation";
import {
    categoryNavigationHandlers,
    topLevelCategoriesExtendedHandlers,
    topLevelCategoriesHandlers,
    mockCategoryNavigation,
} from "@/widgets/CategoryNavigation/testing";

import {createHandlersScenario} from "@/shared/lib/testing";

const meta: Meta<typeof CategoryNavigation> = {
    title: "widgets/CategoryNavigation",
    component: CategoryNavigation,
};

export default meta;
type Story = StoryObj<typeof CategoryNavigation>;

const categoryNavigationHandlersMap = {
    categoryNav: categoryNavigationHandlers,
    topLevelCategories: topLevelCategoriesHandlers,
};

export const Default: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario("default", categoryNavigationHandlersMap),
        },
    },
};

export const DefaultActive: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario("default", categoryNavigationHandlersMap),
        },
    },
    args: {
        slug: mockCategoryNavigation.topLevel.items[0].slug,
    },
};

export const Subcategories: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario("default", categoryNavigationHandlersMap, {
                categoryNav: categoryNavigationHandlers.subcategories,
            }),
        },
    },
};

export const SubcategoriesActive: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario("default", categoryNavigationHandlersMap, {
                categoryNav: categoryNavigationHandlers.subcategories,
            }),
        },
    },
    args: {
        slug: mockCategoryNavigation.withSubcategories.items[0].slug,
    },
};

export const Loading: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario("loading", categoryNavigationHandlersMap),
        },
    },
};

export const Error: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario("error", categoryNavigationHandlersMap),
        },
    },
};

export const Empty: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario("default", categoryNavigationHandlersMap, {
                categoryNav: categoryNavigationHandlers.empty,
                topLevelCategories: topLevelCategoriesExtendedHandlers.empty,
            }),
        },
    },
};
