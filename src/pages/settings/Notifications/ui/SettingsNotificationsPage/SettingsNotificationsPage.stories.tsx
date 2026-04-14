import type {Meta, StoryObj} from "@storybook/react-vite";

import {settingsNotificationsHandlers} from "@/pages/settings/Notifications/api/test/handlers";

import {mockAuthSession} from "@/entities/user/api/test/mockData";

import {createHandlersScenario} from "@/shared/lib/testing";

import SettingsNotificationsPage from "./SettingsNotificationsPage";

const handlersMap = {
    updateEmailNotifications: settingsNotificationsHandlers.updateEmailNotifications,
};

const meta = {
    title: "pages/settings/Notifications/SettingsNotificationsPage",
    component: SettingsNotificationsPage,
    parameters: {
        initialState: {
            user: {
                currency: "USD",
                isSessionReady: true,
                userData: {
                    ...mockAuthSession.user,
                    emailNotificationsEnabled: true,
                },
                accessToken: mockAuthSession.accessToken,
                accessTokenExpiresAt: mockAuthSession.accessTokenExpiresAt,
            },
        } as Partial<StateSchema>,
    },
} satisfies Meta<typeof SettingsNotificationsPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario("default", handlersMap),
        },
    },
};

export const Disabled: Story = {
    parameters: {
        initialState: {
            user: {
                currency: "USD",
                isSessionReady: true,
                userData: {
                    ...mockAuthSession.user,
                    emailNotificationsEnabled: false,
                },
                accessToken: mockAuthSession.accessToken,
                accessTokenExpiresAt: mockAuthSession.accessTokenExpiresAt,
            },
        } as Partial<StateSchema>,
        msw: {
            handlers: createHandlersScenario("default", handlersMap, {
                updateEmailNotifications:
                    settingsNotificationsHandlers.updateEmailNotifications.disabled,
            }),
        },
    },
};
