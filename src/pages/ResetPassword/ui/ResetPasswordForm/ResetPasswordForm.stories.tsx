import type {Meta, StoryObj} from "@storybook/react-vite";

import {userAuthHandlers} from "@/entities/user/api/test/handlers";

import {createHandlersScenario} from "@/shared/lib/testing";

import {ResetPasswordForm} from "./ResetPasswordForm";

const handlersMap = {
    resetPassword: userAuthHandlers.resetPassword,
};

const meta = {
    title: "pages/ResetPassword/ResetPasswordForm",
    component: ResetPasswordForm,
    parameters: {
        layout: "centered",
        route: "/en/reset-password?token=test-token",
        routePath: "/:lng/reset-password",
    },
    decorators: [
        (Story) => (
            <div style={{width: "420px", background: "#fff", padding: "20px"}}>
                <Story />
            </div>
        ),
    ],
    args: {
        token: "test-token",
    },
} satisfies Meta<typeof ResetPasswordForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario("default", handlersMap),
        },
    },
};

export const MissingToken: Story = {
    args: {
        token: null,
    },
};
