import type {Meta, StoryObj} from "@storybook/react-vite";

import VerifyEmailSuccessPage from "./VerifyEmailSuccessPage";

const meta = {
    title: "pages/VerifyEmailSuccessPage",
    component: VerifyEmailSuccessPage,
    parameters: {
        route: "/en/verify-email-success",
        routePath: "/:lng/verify-email-success",
    },
} satisfies Meta<typeof VerifyEmailSuccessPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
