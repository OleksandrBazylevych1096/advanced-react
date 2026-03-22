import type {Meta, StoryObj} from "@storybook/react-vite";

import {userAuthHandlers} from "@/entities/user/api/test/handlers";

import {createHandlersScenario} from "@/shared/libScenario";

import {ForgotPasswordForm} from "./ForgotPasswordForm";

const handlersMap = {
    forgotPassword: userAuthHandlers.forgotPassword,
};

const meta = {
    title: "features/forgot-password/ForgotPasswordForm",
    component: ForgotPasswordForm,
    parameters: {
        layout: "centered",
        route: "/en/forgot-password",
        routePath: "/:lng/forgot-password",
    },
    decorators: [
        (Story) => (
            <div style={{width: "420px", background: "#fff", padding: "20px"}}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof ForgotPasswordForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario("default", handlersMap),
        },
    },
};

export const Error: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario("error", handlersMap),
        },
    },
};

