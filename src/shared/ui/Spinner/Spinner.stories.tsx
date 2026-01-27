import type {Meta, StoryObj} from "@storybook/react-vite";

import {Spinner} from "./Spinner";

const meta = {
    title: "shared/Spinner",
    component: Spinner,
    parameters: {
        layout: "centered",
    },
    globals: {
        backgrounds: {value: 'light'},
    },
    tags: ["autodocs"],
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Secondary: Story = {
    args: {theme: 'secondary'},
    globals: {
        backgrounds: {value: 'dark'},
    },
}

export const Small: Story = {
    args: {
        size: 'sm',
    },
};

export const Medium: Story = {
    args: {
        size: 'md',
    },
};

export const Large: Story = {
    args: {
        size: 'lg',
    },
};