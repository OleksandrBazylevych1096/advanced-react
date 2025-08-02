import type { Meta, StoryObj } from "@storybook/react-vite";

import { ThemeSwitcher } from "./ThemeSwitcher";

const meta = {
  title: "widgets/Header/ThemeSwitcher",
  component: ThemeSwitcher,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ThemeSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
