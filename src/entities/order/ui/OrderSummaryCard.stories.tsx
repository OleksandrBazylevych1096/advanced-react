import type {Meta, StoryObj} from "@storybook/react-vite";

import {OrderSummaryCard} from "./OrderSummaryCard";

const meta = {
    title: "entities/order/OrderSummaryCard",
    component: OrderSummaryCard,
    parameters: {
        layout: "centered",
        initialState: {
            user: {
                currency: "USD",
            },
        } as Partial<StateSchema>,
    },
    decorators: [
        (Story) => (
            <div style={{width: "380px"}}>
                <Story />
            </div>
        ),
    ],
    args: {
        rows: [
            {label: "Items total", amount: 159},
            {label: "Delivery fee", amount: 10},
            {label: "Tax", amount: 8},
        ],
        totalAmount: 177,
    },
} satisfies Meta<typeof OrderSummaryCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomTitle: Story = {
    args: {
        title: "Checkout summary",
        totalLabel: "Grand total",
    },
};
