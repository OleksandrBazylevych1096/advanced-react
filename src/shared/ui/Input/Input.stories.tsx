import type {Meta, StoryObj} from "@storybook/react-vite";

import SearchIcon from "../../assets/icons/Search.svg?react";
import {AppIcon} from "../AppIcon/AppIcon";

import {Input} from "./Input";

const meta = {
    title: "shared/Input",
    component: Input,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: {value: "", placeholder: "Enter text..."},
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        placeholder: "Default",
    },
};

export const WithValue: Story = {
    args: {
        value: "Some value",
    },
};

export const WithLabel: Story = {
    args: {
        label: "Email address",
        placeholder: "Enter your email",
    },
};

export const Password: Story = {
    args: {
        type: "password",
        value: "123",
        label: "Password",
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
        value: "Disabled input",
    },
};

export const Rounded: Story = {
    args: {
        rounded: true,
        placeholder: "Rounded input",
    },
};

export const FullWidth: Story = {
    args: {
        fullWidth: true,
        placeholder: "Full width input",
    },
    decorators: [
        (Story) => (
            <div style={{width: "420px"}}>
                <Story />
            </div>
        ),
    ],
};

export const WithIcon: Story = {
    args: {
        Icon: <AppIcon size={20} Icon={SearchIcon} />,
        placeholder: "Search...",
    },
};

export const Error: Story = {
    args: {
        error: true,
        errorText: "Invalid email format",
        value: "invalid@",
        label: "Email",
    },
};

export const Loading: Story = {
    args: {
        isLoading: true,
        value: "Loading...",
    },
};

export const Currency: Story = {
    args: {
        type: "currency",
        value: "1234.56",
        currency: "USD",
        locale: "en",
        label: "Price",
    },
};

export const CurrencyRounded: Story = {
    args: {
        type: "currency",
        value: "9999.999",
        currency: "USD",
        locale: "en",
        decimal: 2,
        label: "Rounded amount",
    },
};

export const CurrencyFloor: Story = {
    args: {
        type: "currency",
        value: "10.789",
        currency: "USD",
        locale: "en",
        decimal: {places: 2, mode: "floor"},
        label: "Floor amount",
    },
};

export const CurrencyEuro: Story = {
    args: {
        type: "currency",
        value: "5000",
        currency: "EUR",
        locale: "de",
        label: "Price (EUR)",
    },
};
