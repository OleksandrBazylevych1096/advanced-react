import type { Meta, StoryObj } from "@storybook/react-vite";

import { LanguageSwitcher } from "./LanguageSwitcher";

const meta = {
  title: "widgets/Header/LanguageSwitcher",
  component: LanguageSwitcher,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof LanguageSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
