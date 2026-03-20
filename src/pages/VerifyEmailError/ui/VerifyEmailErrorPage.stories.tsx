import type {Meta, StoryObj} from "@storybook/react-vite";

import VerifyEmailErrorPage from "./VerifyEmailErrorPage";

const meta = {
    title: "pages/VerifyEmailErrorPage",
    component: VerifyEmailErrorPage,
    parameters: {
        route: "/en/verify-email-error?reason=token_expired",
        routePath: "/:lng/verify-email-error",
    },
} satisfies Meta<typeof VerifyEmailErrorPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const UnknownReason: Story = {
    parameters: {
        route: "/en/verify-email-error",
    },
};
