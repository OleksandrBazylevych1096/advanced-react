import type { Meta, StoryObj } from "@storybook/react-vite";

import { AuthByGoogleButton } from "./AuthByGoogleButton";

const meta = {
  title: "features/AuthByGoogleButton",
  component: AuthByGoogleButton,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof AuthByGoogleButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
