import type {Meta, StoryObj} from '@storybook/react-vite';

import {categoryHandlers} from "@/entities/category/lib/test/handlers.ts";
import {productsHandlers} from "@/entities/product/lib/test/handlers.ts";

import {Catalog} from './Catalog';

const meta: Meta<typeof Catalog> = {
    title: 'widgets/Catalog',
    component: Catalog,
    parameters: {
        layout: 'fullscreen',
    },
    decorators: [
        (Story) => (
            <div style={{minHeight: '100vh', padding: '20px'}}>
                <Story/>
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof Catalog>;

export const Default: Story = {
    parameters: {
        msw: {
            handlers: [productsHandlers.default, categoryHandlers.default],
        },
    }
};

export const SmallWidth: Story = {
    decorators: [
        (Story) => (
            <div style={{minHeight: '100vh', padding: '20px', width: "600px", margin: '0 auto'}}>
                <Story/>
            </div>
        ),
    ],
    parameters: {
        msw: {
            handlers: [productsHandlers.default, categoryHandlers.default],
        },
    }
};

export const Loading: Story = {
    parameters: {
        msw: {
            handlers: [productsHandlers.loading, categoryHandlers.default],
        },
    },
};

export const Error: Story = {
    parameters: {
        msw: {
            handlers: [productsHandlers.error, categoryHandlers.default],
        },
    },
};

export const Empty: Story = {
    parameters: {
        msw: {
            handlers: [productsHandlers.empty, categoryHandlers.default],
        },
    },
};

