import type {Meta, StoryObj} from "@storybook/react-vite";

import {Stack} from "./Stack";

const meta: Meta<typeof Stack> = {
    title: "shared/Stack",
    component: Stack,
    parameters: {
        layout: "padded",
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Stack>;

export const Column: Story = {
    args: {
        direction: "column",
        gap: 12,
        children: ["Item 1", "Item 2", "Item 3"].map((text) => <div key={text}>{text}</div>),
    },
};

export const Row: Story = {
    args: {
        direction: "row",
        gap: 12,
        children: ["Item 1", "Item 2", "Item 3"].map((text) => <div key={text}>{text}</div>),
    },
};
