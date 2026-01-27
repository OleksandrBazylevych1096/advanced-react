import type {Meta, StoryObj} from '@storybook/react-vite';

import {Price} from './Price';

const meta: Meta<typeof Price> = {
    title: 'shared/Price',
    component: Price,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    args: {
        language: 'en',
        currency: 'USD',
    },
};

export default meta;
type Story = StoryObj<typeof Price>;

export const Default: Story = {
    args: {
        price: 99.99,
        language: 'en',
        currency: 'USD',
    },
};

export const WithDiscount: Story = {
    args: {
        price: 79.99,
        oldPrice: 99.99,
        language: 'en',
        currency: 'USD',
    },
};

export const LargePrice: Story = {
    args: {
        price: 1299.99,
        language: 'en',
        currency: 'USD',
    },
};

export const LargePriceWithDiscount: Story = {
    args: {
        price: 999.99,
        oldPrice: 1499.99,
        language: 'en',
        currency: 'USD',
    },
};

export const SmallPrice: Story = {
    args: {
        price: 9.99,
        language: 'en',
        currency: 'USD',
    },
};


export const EuroCurrency: Story = {
    args: {
        price: 89.99,
        oldPrice: 119.99,
        language: 'de',
        currency: 'EUR',
    },
};


