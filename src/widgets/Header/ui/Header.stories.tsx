import type { Meta, StoryObj } from "@storybook/react-vite";

import { Header } from "./Header";

const meta = {
  title: "widgets/Header",
  component: Header,
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
