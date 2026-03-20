import type {Meta, StoryObj} from "@storybook/react-vite";

import {mockDeliveryDates} from "../../api/test/mockData";

import {ChooseDeliveryDateContent} from "./ChooseDeliveryDateContent";

const commonArgs = {
    isUserHaveDefaultAddress: true,
    isAuthenticated: true,
    isLoading: false,
    isError: false,
    availableDates: mockDeliveryDates,
    selectedDate: mockDeliveryDates[0]?.date ?? null,
    selectedDateSlots: mockDeliveryDates[0]?.slots ?? [],
    selectedTime: mockDeliveryDates[0]?.slots[1] ?? null,
    isSaving: false,
    onNavigateToLogin: () => undefined,
    onRetrySlots: () => undefined,
    onSelectDate: () => undefined,
    onSelectTime: () => undefined,
};

const meta = {
    title: "features/choose-delivery-date/ChooseDeliveryDateContent",
    component: ChooseDeliveryDateContent,
    parameters: {
        layout: "centered",
    },
    decorators: [
        (Story) => (
            <div style={{width: "700px", padding: "24px", background: "#fff"}}>
                <Story />
            </div>
        ),
    ],
    args: commonArgs,
} satisfies Meta<typeof ChooseDeliveryDateContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
    args: {
        isLoading: true,
    },
};

export const Error: Story = {
    args: {
        isError: true,
    },
};

export const Guest: Story = {
    args: {
        isAuthenticated: false,
    },
};

export const NoDefaultAddress: Story = {
    args: {
        isUserHaveDefaultAddress: false,
    },
};

export const Empty: Story = {
    args: {
        availableDates: [],
        selectedDate: null,
        selectedDateSlots: [],
        selectedTime: null,
    },
};
