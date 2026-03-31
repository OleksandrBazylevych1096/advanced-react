import type {Meta, StoryObj} from "@storybook/react-vite";

import {mockSingleAddress} from "@/entities/shipping-address/api/test/mockData";

import {OrderDeliveryAddressCard} from "./OrderDeliveryAddressCard";

const meta = {
    title: "pages/OrderPage/OrderDeliveryAddressCard",
    component: OrderDeliveryAddressCard,
    parameters: {
        layout: "centered",
    },
    decorators: [
        (Story) => (
            <div style={{width: "360px"}}>
                <Story />
            </div>
        ),
    ],
    args: {
        shippingAddress: mockSingleAddress,
    },
} satisfies Meta<typeof OrderDeliveryAddressCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const MissingAddress: Story = {
    args: {
        shippingAddress: undefined,
    },
};
