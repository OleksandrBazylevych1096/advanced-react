import type {Meta, StoryObj} from "@storybook/react-vite";

import SettingsAddressPage from "./SettingsAddressPage";

const meta = {
    title: "pages/settings/Address/SettingsAddressPage",
    component: SettingsAddressPage,
} satisfies Meta<typeof SettingsAddressPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
