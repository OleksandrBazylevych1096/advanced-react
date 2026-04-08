import type {Meta, StoryObj} from "@storybook/react-vite";

import SettingsSecurityPage from "./SettingsSecurityPage";

const meta = {
    title: "pages/settings/Security/SettingsSecurityPage",
    component: SettingsSecurityPage,
} satisfies Meta<typeof SettingsSecurityPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
