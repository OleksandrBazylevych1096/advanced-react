import type { Meta, StoryObj } from "@storybook/react-vite";

import { Tabs } from "./Tabs";

const meta: Meta<typeof Tabs> = {
  title: "shared/Tabs",
  component: Tabs,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const TwoTabs: Story = {
  render: () => (
    <Tabs defaultValue="one">
      <Tabs.List>
        <Tabs.Trigger value="one">One</Tabs.Trigger>
        <Tabs.Trigger value="two">Two</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="one">Content One</Tabs.Content>
      <Tabs.Content value="two">Content Two</Tabs.Content>
    </Tabs>
  ),
};
