import type {Meta, StoryObj} from '@storybook/react-vite';

import type {Product} from '../../model/types/Product';

import {ProductCard} from './ProductCard';

const meta = {
    title: 'entities/product/ProductCard',
    component: ProductCard,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <div style={{padding: '20px'}}>
                <Story/>
            </div>
        ),
    ],
} satisfies Meta<typeof ProductCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const baseProduct: Product = {
    id: '1',
    name: 'Wireless Headphones',
    description: 'skskskmsfmfmfm',
    slug: 'headphones',
    shortDescription: 'Premium sound quality',
    price: 99.99,
    stock: 15,
    images: [
        {
            url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
            alt: 'Wireless Headphones',
            isMain: true,
        },
    ],
};

export const Default: Story = {
    args: {
        product: baseProduct,
    },
};

export const WithDiscount: Story = {
    args: {
        product: {
            ...baseProduct,
            oldPrice: 149.99,
        },
    },
};

export const LowStock: Story = {
    args: {
        product: {
            ...baseProduct,
            stock: 3,
        },
    },
};

export const LowStockWithDiscount: Story = {
    args: {
        product: {
            ...baseProduct,
            stock: 5,
            oldPrice: 149.99,
        },
    },
};

export const OutOfStock: Story = {
    args: {
        product: {
            ...baseProduct,
            stock: 0,
        },
    },
};

export const LongProductName: Story = {
    args: {
        product: {
            ...baseProduct,
            name: 'Premium Wireless Noise-Cancelling Over-Ear Headphones',
        },
    },
};

export const NoImage: Story = {
    args: {
        product: {
            ...baseProduct,
            images: [],
        },
    },
};


