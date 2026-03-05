import type {Meta, StoryObj} from "@storybook/react-vite";

import {Grid} from "./Grid";

const meta: Meta<typeof Grid> = {
    title: "shared/Grid",
    component: Grid,
    parameters: {
        layout: "padded",
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Grid>;

export const ThreeColumns: Story = {
    args: {
        cols: 3,
        gap: 16,
        children: ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5", "Item 6"].map((text) => (
            <div key={text}>{text}</div>
        )),
    },
};

export const TwoColumns: Story = {
    args: {
        cols: 2,
        gap: 12,
        children: ["Item 1", "Item 2", "Item 3", "Item 4"].map((text) => (
            <div key={text}>{text}</div>
        )),
    },
};
