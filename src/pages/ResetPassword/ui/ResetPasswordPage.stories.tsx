import type {Meta, StoryObj} from "@storybook/react-vite";

import {userAuthHandlers} from "@/entities/user/api/test/handlers";

import {createHandlersScenario} from "@/shared/libScenario";

import ResetPasswordPage from "./ResetPasswordPage";

const handlersMap = {
    resetPassword: userAuthHandlers.resetPassword,
};

const meta = {
    title: "pages/ResetPasswordPage",
    component: ResetPasswordPage,
    parameters: {
        route: "/en/reset-password?token=test-token",
        routePath: "/:lng/reset-password",
    },
} satisfies Meta<typeof ResetPasswordPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    parameters: {msw: {handlers: createHandlersScenario("default", handlersMap)}},
};

export const MissingToken: Story = {
    parameters: {
        route: "/en/reset-password",
    },
};
