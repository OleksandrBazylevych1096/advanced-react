import type {Meta, StoryObj} from "@storybook/react-vite";

import {userAuthHandlers, mockAuthSession} from "@/entities/user/testing";

import {createHandlersScenario} from "@/shared/lib/testing";

import SettingsSecurityPage from "./SettingsSecurityPage";

const handlersMap = {
    sessions: userAuthHandlers.sessions,
    setupTwoFactor: userAuthHandlers.setupTwoFactor,
    enableTwoFactor: userAuthHandlers.enableTwoFactor,
    unlinkGoogle: userAuthHandlers.unlinkGoogle,
};

const meta = {
    title: "pages/settings/Security/SettingsSecurityPage",
    component: SettingsSecurityPage,
    parameters: {
        initialState: {
            user: {
                currency: "USD",
                isSessionReady: true,
                userData: mockAuthSession.user,
                accessToken: mockAuthSession.accessToken,
                accessTokenExpiresAt: mockAuthSession.accessTokenExpiresAt,
            },
        } as Partial<StateSchema>,
    },
} satisfies Meta<typeof SettingsSecurityPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario("default", handlersMap),
        },
    },
};

export const Loading: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario("loading", handlersMap),
        },
    },
};

export const EmptySessions: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario("default", handlersMap, {
                sessions: userAuthHandlers.sessions.empty,
            }),
        },
    },
};
