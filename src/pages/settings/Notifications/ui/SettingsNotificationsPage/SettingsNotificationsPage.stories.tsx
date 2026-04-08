import type {Meta, StoryObj} from "@storybook/react-vite";

import SettingsNotificationsPage from "./SettingsNotificationsPage";

const meta = {
    title: "pages/settings/Notifications/SettingsNotificationsPage",
    component: SettingsNotificationsPage,
} satisfies Meta<typeof SettingsNotificationsPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
