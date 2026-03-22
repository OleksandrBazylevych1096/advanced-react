import type {Meta, StoryObj} from "@storybook/react-vite";

import {userAuthHandlers} from "@/entities/user/api/test/handlers";
import {mockAuthSession} from "@/entities/user/api/test/mockData";

import {createHandlersScenario} from "@/shared/libScenario";

import SessionsPage from "./SessionsPage";

const handlersMap = {
    sessions: userAuthHandlers.sessions,
    revokeSession: userAuthHandlers.revokeSession,
    revokeAllSessions: userAuthHandlers.revokeAllSessions,
};

const meta = {
    title: "pages/SessionsPage",
    component: SessionsPage,
    parameters: {
        initialState: {
            user: {
                currency: "USD",
                userData: mockAuthSession.user,
                accessToken: mockAuthSession.accessToken,
                accessTokenExpiresAt: mockAuthSession.accessTokenExpiresAt,
            },
        } as Partial<StateSchema>,
    },
} satisfies Meta<typeof SessionsPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    parameters: {msw: {handlers: createHandlersScenario("default", handlersMap)}},
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

