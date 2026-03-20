import type {Meta, StoryObj} from "@storybook/react-vite";

import {Progress} from "./Progress";

const meta = {
    title: "shared/Progress",
    component: Progress,
    parameters: {layout: "centered"},
    decorators: [
        (Story) => (
            <div style={{width: "320px"}}>
                <Story />
            </div>
        ),
    ],
    args: {
        value: 45,
        max: 100,
        ariaLabel: "Progress",
    },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Completed: Story = {
    args: {
        value: 100,
    },
};
