import type { Meta, StoryObj } from "@storybook/react-vite";

import { OTPInput } from "./OTPInput";

const meta = {
  title: "shared/Input/OTPInput",
  component: OTPInput,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof OTPInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Length6: Story = {
  args: {
    length: 6,
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
