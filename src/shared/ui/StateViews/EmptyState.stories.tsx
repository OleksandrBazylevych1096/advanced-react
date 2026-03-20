import type {Meta, StoryObj} from "@storybook/react-vite";

import {Button} from "@/shared/ui/Button/Button";

import {EmptyState} from "./EmptyState";

const meta = {
    title: "shared/StateViews/EmptyState",
    component: EmptyState,
    parameters: {layout: "centered"},
    args: {
        title: "No data",
        description: "Nothing found for current filters",
    },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithAction: Story = {
    args: {
        action: <Button size="sm">Create item</Button>,
    },
};
