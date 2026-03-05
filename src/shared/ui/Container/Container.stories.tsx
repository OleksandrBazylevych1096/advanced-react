import type {Meta, StoryObj} from "@storybook/react-vite";

import {Container} from "./Container";

const meta: Meta<typeof Container> = {
    title: "shared/Container",
    component: Container,
    parameters: {
        layout: "fullscreen",
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Container>;

export const Content: Story = {
    args: {
        size: "content",
        children: "Content container",
    },
};

export const Fluid: Story = {
    args: {
        size: "fluid",
        children: "Fluid container",
    },
};
