import type {Meta, StoryObj} from "@storybook/react-vite";

import {DisplayShippingAddress} from "./DisplayShippingAddress";

const meta = {
    title: "widgets/ManageShippingAddress/DisplayShippingAddress",
    component: DisplayShippingAddress,
    parameters: {
        layout: "centered",
    },
    args: {
        isLoading: false,
        isError: false,
        streetAddress: "221B Baker Street",
    },
} satisfies Meta<typeof DisplayShippingAddress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
    args: {
        isLoading: true,
    },
};

export const Fallback: Story = {
    args: {
        isError: true,
        streetAddress: undefined,
    },
};
