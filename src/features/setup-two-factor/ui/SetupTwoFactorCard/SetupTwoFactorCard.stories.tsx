import type {Meta, StoryObj} from "@storybook/react-vite";

import {mockAuthSession} from "@/entities/user/api/test/mockData";

import {SetupTwoFactorCard} from "./SetupTwoFactorCard";

const meta = {
    title: "features/setup-two-factor/SetupTwoFactorCard",
    component: SetupTwoFactorCard,
    parameters: {
        layout: "centered",
        initialState: {
            user: {
                currency: "USD",
                userData: mockAuthSession.user,
                accessToken: mockAuthSession.accessToken,
                accessTokenExpiresAt: mockAuthSession.accessTokenExpiresAt,
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
} satisfies Meta<typeof SetupTwoFactorCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Disabled: Story = {};

export const Enabled: Story = {
    parameters: {
        initialState: {
            user: {
                currency: "USD",
                userData: {
                    ...mockAuthSession.user,
                    isTwoFactorEnabled: true,
                },
                accessToken: mockAuthSession.accessToken,
                accessTokenExpiresAt: mockAuthSession.accessTokenExpiresAt,
            },
        } as Partial<StateSchema>,
    },
};
