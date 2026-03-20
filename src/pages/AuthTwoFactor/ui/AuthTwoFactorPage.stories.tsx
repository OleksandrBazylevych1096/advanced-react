import type {Meta, StoryObj} from "@storybook/react-vite";

import {mockMfaChallenge} from "@/entities/user/api/test/mockData";

import AuthTwoFactorPage from "./AuthTwoFactorPage";

const meta = {
    title: "pages/AuthTwoFactorPage",
    component: AuthTwoFactorPage,
    parameters: {
        route: "/en/two-factor",
        routePath: "/:lng/two-factor",
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
} satisfies Meta<typeof AuthTwoFactorPage>;

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
