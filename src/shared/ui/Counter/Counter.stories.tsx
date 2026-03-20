import type {Meta, StoryObj} from "@storybook/react-vite";

import {Counter} from "./Counter";

const meta = {
    title: "shared/Counter",
    component: Counter,
    parameters: {layout: "centered"},
    args: {
        from: 0,
        to: 120,
        durationMs: 1200,
    },
} satisfies Meta<typeof Counter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Formatted: Story = {
    args: {
        to: 3500,
        formatter: (value: number) => `${value} users`,
    },
};
