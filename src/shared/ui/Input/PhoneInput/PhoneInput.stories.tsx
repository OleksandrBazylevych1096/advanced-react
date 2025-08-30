import type { Meta, StoryObj } from "@storybook/react-vite";

import { PhoneInput } from "./PhoneInput";

const meta = {
  title: "shared/Input/PhoneInput",
  component: PhoneInput,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PhoneInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = {
  args: {
    value: "+1 111 111 111",
  },
};

export const WithLabel: Story = {
  args: {
    label: "Phone",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Error: Story = {
  args: {
    error: true,
  },
};
