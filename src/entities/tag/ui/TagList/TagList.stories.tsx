import type {Meta, StoryObj} from '@storybook/react-vite';
import {fn} from "storybook/test";

import type {Tag} from '../../model/types/Tag';

import {TagList} from './TagList';

const meta = {
    title: 'entities/tag/TagList',
    component: TagList,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    args: {
        onTagChange: fn(),
    },
} satisfies Meta<typeof TagList>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockTags: Tag[] = [
    {id: '1', name: 'Electronics', slug: 'electronics'},
    {id: '2', name: 'Clothing', slug: 'clothing'},
    {id: '3', name: 'Home & Garden', slug: 'home-garden'},
    {id: '4', name: 'Sports', slug: 'sports'},
    {id: '5', name: 'Books', slug: 'books'},
    {id: '6', name: 'Toys', slug: 'toys'},
];

export const Default: Story = {
    args: {
        tags: mockTags,
        isLoading: false,
    },
};

export const WithSelectedTag: Story = {
    args: {
        tags: mockTags,
        isLoading: false,
        currentTagId: '3',
    },
};

export const Loading: Story = {
    args: {
        isLoading: true,
    },
};

export const SingleTag: Story = {
    args: {
        tags: [{id: '1', name: 'Electronics', slug: 'electronics'}],
        isLoading: false,
    },
};

export const Empty: Story = {
    args: {
        tags: [],
        isLoading: false,
    },
};

export const ManyTags: Story = {
    args: {
        tags: [
            ...mockTags,
            {id: '7', name: 'Health & Beauty', slug: 'health-beauty'},
            {id: '8', name: 'Automotive', slug: 'automotive'},
            {id: '9', name: 'Pet Supplies', slug: 'pet-supplies'},
            {id: '10', name: 'Office Products', slug: 'office-products'},
            {id: '11', name: 'Grocery & Gourmet', slug: 'grocery-gourmet'},
            {id: '12', name: 'Musical Instruments', slug: 'musical-instruments'},
        ],
        isLoading: false,
        currentTagId: '7',
    },
};

export const LongTagNames: Story = {
    args: {
        tags: [
            {id: '1', name: 'Consumer Electronics & Gadgets', slug: 'consumer-electronics-gadgets'},
            {id: '2', name: 'Fashion & Apparel', slug: 'fashion-apparel'},
            {id: '3', name: 'Home Improvement & Decoration', slug: 'home-improvement-decoration'},
        ],
        isLoading: false,
    },
};


