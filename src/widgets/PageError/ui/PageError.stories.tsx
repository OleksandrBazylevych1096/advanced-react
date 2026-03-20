import type {Meta, StoryObj} from "@storybook/react-vite";

import {PageError} from "./PageError";

const meta = {
    title: "widgets/PageError",
    component: PageError,
    parameters: {
        layout: "fullscreen",
    },
} satisfies Meta<typeof PageError>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithCustomError: Story = {
    args: {
        error: "Unknown error. Please try again.",
    },
};

export const WithLongMessage: Story = {
    args: {
        error: "Payment session expired while waiting for confirmation. Reload the page and create a new checkout session.",
    },
};
