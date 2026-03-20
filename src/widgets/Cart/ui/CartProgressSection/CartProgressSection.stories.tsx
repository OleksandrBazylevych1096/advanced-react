import type {Meta, StoryObj} from "@storybook/react-vite";

import {CartProgressSection} from "./CartProgressSection";

const meta = {
    title: "widgets/Cart/CartProgressSection",
    component: CartProgressSection,
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
            <div style={{width: "360px"}}>
                <Story />
            </div>
        ),
    ],
    args: {
        value: 120,
        target: 200,
        ariaLabel: "Cart subtotal progress",
    },
} satisfies Meta<typeof CartProgressSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Completed: Story = {
    args: {
        value: 220,
    },
};
