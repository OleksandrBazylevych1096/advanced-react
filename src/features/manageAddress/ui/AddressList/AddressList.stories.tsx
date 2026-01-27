import type {Meta, StoryObj} from "@storybook/react-vite";


import {handlers} from "../../lib/test/handlers";

import {AddressList} from "./AddressList";

const meta = {
    title: "features/manageAddress/AddressList",
    component: AddressList,
    parameters: {
        layout: "centered",
    },
} satisfies Meta<typeof AddressList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithAddresses: Story = {
    parameters: {
        msw: {
            handlers: [handlers.listSuccess],
        },
    },
};

export const SingleAddress: Story = {
    parameters: {
        msw: {
            handlers: [handlers.listSingle],
        },
    },
};

export const EmptyList: Story = {
    parameters: {
        msw: {
            handlers: [handlers.listEmpty],
        },
    },
};

export const Loading: Story = {
    parameters: {
        msw: {
            handlers: [handlers.listLoading],
        },
    },
};

export const Error: Story = {
    parameters: {
        msw: {
            handlers: [handlers.listError],
        },
    },
};

