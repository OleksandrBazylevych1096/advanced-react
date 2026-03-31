import type {Meta, StoryObj} from "@storybook/react-vite";

import {Timeline} from "./Timeline";

const meta = {
    title: "shared/Timeline",
    component: Timeline,
    parameters: {layout: "centered"},
    decorators: [
        (Story) => (
            <div style={{width: "760px", maxWidth: "100%"}}>
                <Story />
            </div>
        ),
    ],
    args: {
        events: [
            {state: "done", label: "Apr 5, 2022, 10:07 AM", progress: 100},
            {state: "active", label: "Apr 6, 2022, 12:10 PM", progress: 45},
            {state: "upcoming", label: "Apr 7, 2022, 03:20 PM", progress: 0},
        ],
    },
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TwoSteps: Story = {
    args: {
        events: [
            {state: "done", label: "Order confirmed", progress: 100},
            {state: "active", label: "Processing", progress: 65},
        ],
    },
};

export const Empty: Story = {
    args: {
        events: [],
    },
};
