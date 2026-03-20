import type {Meta, StoryObj} from "@storybook/react-vite";

import {mockCart} from "@/entities/cart/api/test/mockData";

import {ReviewOrderItems} from "./ReviewOrderItems";

const meta = {
    title: "widgets/ReviewOrderItems",
    component: ReviewOrderItems,
    parameters: {
        layout: "centered",
    },
    decorators: [
        (Story) => (
            <div style={{width: "720px", background: "#fff", padding: "16px"}}>
                <Story />
            </div>
        ),
    ],
    args: {
        items: mockCart.items,
        currency: "USD",
    },
} satisfies Meta<typeof ReviewOrderItems>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SingleItem: Story = {
    args: {
        items: [mockCart.items[0]],
    },
};
