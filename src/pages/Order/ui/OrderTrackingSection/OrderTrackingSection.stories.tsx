import type {Meta, StoryObj} from "@storybook/react-vite";

import {
    mockOrderDetailsDelivered,
    mockOrderDetailsNoDeliveryDate,
    mockOrderDetailsProcessing,
} from "@/entities/order/api/test/mockData";

import {OrderTrackingSection} from "./OrderTrackingSection";

const meta = {
    title: "pages/OrderPage/OrderTrackingSection",
    component: OrderTrackingSection,
    parameters: {
        layout: "centered",
    },
    decorators: [
        (Story) => (
            <div style={{width: "880px", maxWidth: "100%"}}>
                <Story />
            </div>
        ),
    ],
    args: {
        order: mockOrderDetailsProcessing,
    },
} satisfies Meta<typeof OrderTrackingSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ActiveOrder: Story = {};

export const DeliveredOrder: Story = {
    args: {
        order: mockOrderDetailsDelivered,
    },
};

export const NoDeliveryDate: Story = {
    args: {
        order: mockOrderDetailsNoDeliveryDate,
    },
};

export const FallbackWithoutActiveStep: Story = {
    args: {
        order: {
            ...mockOrderDetailsProcessing,
            timeline: mockOrderDetailsProcessing.timeline.map((event) =>
                event.id === "processing" ? {...event, timestamp: null} : event,
            ),
        },
    },
};
