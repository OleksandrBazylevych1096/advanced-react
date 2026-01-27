import type {Meta, StoryObj} from '@storybook/react-vite';

import {Breadcrumbs} from './Breadcrumbs';

const meta: Meta<typeof Breadcrumbs> = {
    title: 'shared/Breadcrumbs',
    component: Breadcrumbs,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Breadcrumbs>;

export const Default: Story = {
    args: {
        items: [
            {label: 'Catalog', href: '/catalog'},
            {label: 'Electronics', href: '/catalog/electronics'},
            {label: 'Laptops', href: '/catalog/electronics/laptops'},
            {label: 'MacBook Pro 14"'},
        ],
    },
};

export const SingleLevel: Story = {
    args: {
        items: [
            {label: 'About Us'},
        ],
    },
};

export const MultipleLevelsDeepNavigation: Story = {
    args: {
        items: [
            {label: 'Products', href: '/products'},
            {label: 'Clothing & Shoes', href: '/products/clothing'},
            {label: 'Men Clothing', href: '/products/clothing/men'},
            {label: 'Outerwear', href: '/products/clothing/men/outerwear'},
            {label: 'Jackets', href: '/products/clothing/men/outerwear/jackets'},
            {label: 'Winter Jackets'},
        ],
    },
};

export const ItemWithoutHref: Story = {
    args: {
        items: [
            {label: 'Category', href: '/category'},
            {label: 'Subcategory (no link)'},
            {label: 'Products', href: '/category/subcategory/products'},
            {label: 'Current Product'},
        ],
    },
};

export const CustomSeparator: Story = {
    args: {
        items: [
            {label: 'Dashboard', href: '/dashboard'},
            {label: 'Settings', href: '/dashboard/settings'},
            {label: 'Profile'},
        ],
        Separator: '›',
    },
};


export const EmptyItems: Story = {
    args: {
        items: [],
    },
};

export const UndefinedItems: Story = {
    args: {
        items: undefined,
    },
};

