import type {Meta, StoryObj} from "@storybook/react-vite";

import {Box} from "./Box";

const meta: Meta<typeof Box> = {
    title: "shared/Box",
    component: Box,
    parameters: {
        layout: "padded",
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Box>;

export const Default: Story = {
    args: {
        children: "Box content",
    },
};

export const AsSection: Story = {
    args: {
        as: "section",
        children: "Section box",
    },
};
