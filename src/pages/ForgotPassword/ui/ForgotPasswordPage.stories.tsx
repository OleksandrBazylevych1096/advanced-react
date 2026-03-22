import type {Meta, StoryObj} from "@storybook/react-vite";

import {userAuthHandlers} from "@/entities/user/api/test/handlers";

import {createHandlersScenario} from "@/shared/libScenario";

import ForgotPasswordPage from "./ForgotPasswordPage";

const handlersMap = {
    forgotPassword: userAuthHandlers.forgotPassword,
};

const meta = {
    title: "pages/ForgotPasswordPage",
    component: ForgotPasswordPage,
    parameters: {
        route: "/en/forgot-password",
        routePath: "/:lng/forgot-password",
    },
} satisfies Meta<typeof ForgotPasswordPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    parameters: {msw: {handlers: createHandlersScenario("default", handlersMap)}},
};

export const Error: Story = {
    parameters: {msw: {handlers: createHandlersScenario("error", handlersMap)}},
};
