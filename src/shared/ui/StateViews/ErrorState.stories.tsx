import type {Meta, StoryObj} from "@storybook/react-vite";

import {ErrorState} from "./ErrorState";

const meta = {
    title: "shared/StateViews/ErrorState",
    component: ErrorState,
    parameters: {layout: "centered"},
    args: {
        message: "Something went wrong",
    },
} satisfies Meta<typeof ErrorState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithRetry: Story = {
    args: {
        onRetry: () => undefined,
    },
};
