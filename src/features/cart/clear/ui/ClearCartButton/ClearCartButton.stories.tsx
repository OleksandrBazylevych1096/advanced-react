import type {Meta, StoryObj} from "@storybook/react-vite";

import {ClearCartButton} from "./ClearCartButton";

const meta = {
    title: "features/clear-cart/ClearCartButton",
    component: ClearCartButton,
    parameters: {layout: "centered"},
    args: {
        onClear: () => undefined,
    },
} satisfies Meta<typeof ClearCartButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
    args: {
        isLoading: true,
    },
};
