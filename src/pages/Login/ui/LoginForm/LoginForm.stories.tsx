import type {Meta, StoryObj} from "@storybook/react-vite";

import {LoginForm} from "./LoginForm";

const meta = {
    title: "pages/Login/LoginForm",
    component: LoginForm,
    parameters: {
        layout: "centered",
        route: "/en/login",
        routePath: "/:lng/login",
    },
    decorators: [
        (Story) => (
            <div style={{width: "420px", background: "#fff", padding: "20px"}}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof LoginForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
