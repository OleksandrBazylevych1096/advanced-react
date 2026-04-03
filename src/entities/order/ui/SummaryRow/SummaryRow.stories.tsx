import type {Meta, StoryObj} from "@storybook/react-vite";

import {SummaryRow} from "./SummaryRow.tsx";

const meta = {
    title: "entities/order/SummaryRow",
    component: SummaryRow,
    parameters: {
        layout: "centered",
    },
    decorators: [
        (Story) => (
            <div style={{width: "360px", background: "#fff", padding: "16px"}}>
                <Story />
            </div>
        ),
    ],
    args: {
        label: "Items total",
        value: "$159.00",
    },
} satisfies Meta<typeof SummaryRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Emphasized: Story = {
    args: {
        label: "Total",
        value: "$177.00",
        emphasized: true,
    },
};
