import type {Meta, StoryObj} from "@storybook/react-vite";

import {mockMfaChallenge} from "@/entities/user/api/test/mockData";

import {AuthTwoFactorChallenge} from "./AuthTwoFactorChallenge";

const meta = {
    title: "pages/AuthTwoFactor/AuthTwoFactorChallenge",
    component: AuthTwoFactorChallenge,
    parameters: {
        layout: "centered",
        initialState: {
            user: {
                currency: "USD",
                pendingMfaChallenge: {
                    mfaToken: mockMfaChallenge.mfaToken,
                    mfaTokenExpiresAt: mockMfaChallenge.mfaTokenExpiresAt,
                    availableMethods: mockMfaChallenge.availableMethods,
                },
            },
        } as Partial<StateSchema>,
    },
    decorators: [
        (Story) => (
            <div style={{width: "460px", background: "#fff", padding: "20px"}}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof AuthTwoFactorChallenge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const MissingChallenge: Story = {
    parameters: {
        initialState: {
            user: {
                currency: "USD",
                pendingMfaChallenge: undefined,
            },
        } as Partial<StateSchema>,
    },
};
