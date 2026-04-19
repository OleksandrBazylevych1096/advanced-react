import type {Meta, StoryObj} from "@storybook/react-vite";

import {settingsOrdersHandlers} from "@/pages/settings/Orders/testing";

import {mockAuthSession} from "@/entities/user/testing";

import {createHandlersScenario} from "@/shared/lib/testing";

import SettingsOrdersPage from "./SettingsOrdersPage";

const handlersMap = {
    getMyOrders: settingsOrdersHandlers.getMyOrders,
};

const meta = {
    title: "pages/settings/Orders/SettingsOrdersPage",
    component: SettingsOrdersPage,
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
} satisfies Meta<typeof SettingsOrdersPage>;

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

export const Empty: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario("default", handlersMap, {
                getMyOrders: settingsOrdersHandlers.getMyOrders.empty,
            }),
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
