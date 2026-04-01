import type {Meta, StoryObj} from "@storybook/react-vite";

import {CancelOrder} from "./CancelOrder";

const meta = {
    title: "features/checkout/cancel-order/CancelOrder",
    component: CancelOrder,
    args: {
        orderId: "order-1",
    },
    decorators: [
        (Story) => (
            <div style={{width: "fit-content", background: "#fff", padding: "16px"}}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof CancelOrder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
