import type {Meta, StoryObj} from "@storybook/react-vite";

import {chooseDeliveryTipReducer} from "@/features/choose-delivery-tip";

import {DeliveryTip} from "./DeliveryTip";

const baseInitialState: Partial<StateSchema> = {
    user: {
        currency: "USD",
        isSessionReady: true,
    },
    chooseDeliveryTip: {
        amount: 0,
    },
};

const meta = {
    title: "features/choose-delivery-tip/DeliveryTip",
    component: DeliveryTip,
    parameters: {
        initialState: baseInitialState,
        asyncReducers: {
            chooseDeliveryTip: chooseDeliveryTipReducer,
        },
    },
    decorators: [
        (Story) => (
            <div style={{width: "360px", background: "#fff", padding: "16px"}}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof DeliveryTip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const PresetSelected: Story = {
    parameters: {
        initialState: {
            ...baseInitialState,
            chooseDeliveryTip: {
                amount: 5,
            },
        } as Partial<StateSchema>,
    },
};

export const CustomValue: Story = {
    parameters: {
        initialState: {
            ...baseInitialState,
            chooseDeliveryTip: {
                amount: 7,
            },
        } as Partial<StateSchema>,
    },
};
