import type {Meta, StoryObj} from "@storybook/react-vite";

import {userAuthHandlers} from "@/entities/user/api/test/handlers";
import {mockAuthSession} from "@/entities/user/api/test/mockData";

import {createHandlersScenario} from "@/shared/libScenario";

import {ManageSessions} from "./ManageSessions";

const handlersMap = {
    sessions: userAuthHandlers.sessions,
    revokeSession: userAuthHandlers.revokeSession,
    revokeAllSessions: userAuthHandlers.revokeAllSessions,
};

const meta = {
    title: "features/manage-sessions/ManageSessions",
    component: ManageSessions,
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
    decorators: [
        (Story) => (
            <div style={{width: "760px", background: "#fff", padding: "20px"}}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof ManageSessions>;

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
                sessions: userAuthHandlers.sessions.empty,
            }),
        },
    },
};
