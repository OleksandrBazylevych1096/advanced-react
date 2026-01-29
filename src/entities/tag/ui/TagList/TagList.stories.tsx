import type {Meta, StoryObj} from '@storybook/react-vite';
import {fn} from "storybook/test";

import {createMockTag, mockTags} from "@/entities/tag/api/test/mockData.ts";

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
        tags: createMockTag.createList(1),
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
        tags: createMockTag.createList(20),
        isLoading: false,
        currentTagId: '7',
    },
};


