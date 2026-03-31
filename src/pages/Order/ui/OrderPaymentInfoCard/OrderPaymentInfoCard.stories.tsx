import type {Meta, StoryObj} from "@storybook/react-vite";

import {OrderPaymentInfoCard} from "./OrderPaymentInfoCard";

const meta = {
    title: "pages/OrderPage/OrderPaymentInfoCard",
    component: OrderPaymentInfoCard,
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
        brand: "visa",
        last4: "4242",
    },
} satisfies Meta<typeof OrderPaymentInfoCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Visa: Story = {};

export const UnknownBrand: Story = {
    args: {
        brand: "unknown-brand",
        last4: "1111",
    },
};

export const NoCardData: Story = {
    args: {
        brand: null,
        last4: null,
    },
};
