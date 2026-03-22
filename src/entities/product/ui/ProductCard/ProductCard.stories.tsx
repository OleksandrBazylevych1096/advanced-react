import type {Meta, StoryObj} from "@storybook/react-vite";

import {createMockProduct} from "@/entities/product.ts";

import {ProductCard} from "./ProductCard";

const meta = {
    title: "entities/product/ProductCard",
    component: ProductCard,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    decorators: [
        (Story) => (
            <div style={{padding: "20px"}}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof ProductCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const baseProduct = createMockProduct({price: 100});

export const Default: Story = {
    args: {
        product: baseProduct,
        currency: "USD",
    },
};

export const WithDiscount: Story = {
    args: {
        product: {
            ...baseProduct,
            oldPrice: 149.99,
        },
        currency: "USD",
    },
};

export const LowStock: Story = {
    args: {
        product: {
            ...baseProduct,
            stock: 3,
        },
        currency: "USD",
    },
};

export const LowStockWithDiscount: Story = {
    args: {
        product: {
            ...baseProduct,
            stock: 5,
            oldPrice: 149.99,
        },
        currency: "USD",
    },
};

export const OutOfStock: Story = {
    args: {
        product: {
            ...baseProduct,
            stock: 0,
        },
        currency: "USD",
    },
};

export const LongProductName: Story = {
    args: {
        product: {
            ...baseProduct,
            name: "Premium Wireless Noise-Cancelling Over-Ear Headphones",
        },
        currency: "USD",
    },
};

export const NoImage: Story = {
    args: {
        product: {
            ...baseProduct,
            images: [],
        },
        currency: "USD",
    },
};
