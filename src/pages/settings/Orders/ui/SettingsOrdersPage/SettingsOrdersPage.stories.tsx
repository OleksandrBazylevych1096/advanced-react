import type {Meta, StoryObj} from "@storybook/react-vite";

import SettingsOrdersPage from "./SettingsOrdersPage";

const meta = {
    title: "pages/settings/Orders/SettingsOrdersPage",
    component: SettingsOrdersPage,
} satisfies Meta<typeof SettingsOrdersPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
