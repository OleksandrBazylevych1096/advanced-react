import type {Meta, StoryObj} from "@storybook/react-vite";

import {categoryHandlers} from "@/entities/category";
import {mockCategories} from "@/entities/category/api/test/mockData";
import {productsHandlers} from "@/entities/product";

import {createHandlersScenario} from "@/shared/libScenario.ts";

import {Catalog} from "./Catalog";

const meta: Meta<typeof Catalog> = {
    title: "widgets/Catalog",
    component: Catalog,
    args: {
        categoryId: mockCategories[0].id,
    },
    parameters: {
        layout: "fullscreen",
    },
    decorators: [
        (Story) => (
            <div style={{minHeight: "100vh", padding: "20px"}}>
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof Catalog>;

const catalogHandlersMap = {
    products: productsHandlers,
    category: categoryHandlers,
};

export const Default: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario("default", catalogHandlersMap),
        },
    },
};

export const SmallWidth: Story = {
    decorators: [
        (Story) => (
            <div style={{minHeight: "100vh", padding: "20px", width: "600px", margin: "0 auto"}}>
                <Story />
            </div>
        ),
    ],
    parameters: {
        msw: {
            handlers: createHandlersScenario("default", catalogHandlersMap),
        },
    },
};

export const Loading: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario("loading", catalogHandlersMap, {
                category: categoryHandlers.default,
            }),
        },
    },
};

export const Error: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario("error", catalogHandlersMap, {
                category: categoryHandlers.default,
            }),
        },
    },
};

export const Empty: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario("default", catalogHandlersMap, {
                products: productsHandlers.empty,
            }),
        },
    },
};
