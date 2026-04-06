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
            {id: "order_placed", state: "done", label: "Order Placed", progress: 100},
            {id: "processing", state: "done", label: "Processing", progress: 15},
            {id: "shipped", state: "upcoming", label: "Shipped", progress: 0},
            {id: "delivered", state: "upcoming", label: "Delivered", progress: 0},
        ],
    },
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Shipped: Story = {
    args: {
        events: [
            {id: "order_placed", state: "done", label: "Order Placed", progress: 100},
            {id: "processing", state: "done", label: "Processing", progress: 100},
            {id: "shipped", state: "done", label: "Shipped", progress: 45},
            {id: "delivered", state: "upcoming", label: "Delivered", progress: 0},
        ],
    },
};

export const Delivered: Story = {
    args: {
        events: [
            {id: "order_placed", state: "done", label: "Order Placed", progress: 100},
            {id: "processing", state: "done", label: "Processing", progress: 100},
            {id: "shipped", state: "done", label: "Shipped", progress: 100},
            {id: "delivered", state: "done", label: "Delivered", progress: 100},
        ],
    },
};

export const Empty: Story = {
    args: {
        events: [],
    },
};
