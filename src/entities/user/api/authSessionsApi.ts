import {baseAPI} from "@/shared/api";

import type {AuthSessionsListItem} from "../model/types/AuthSession";

type RevokeAllSessionsArgs = {
    includeCurrent?: boolean;
};

type SuccessResponse = {
    success: true;
};

export const authSessionsApi = baseAPI.injectEndpoints({
    endpoints: (build) => ({
        getAuthSessions: build.query<AuthSessionsListItem[], void>({
            query: () => ({
                url: "/auth/sessions",
                method: "GET",
            }),
            providesTags: ["UserSession"],
        }),
        revokeAuthSession: build.mutation<SuccessResponse, string>({
            query: (sessionId) => ({
                url: `/auth/sessions/${sessionId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["UserSession"],
        }),
        revokeAllAuthSessions: build.mutation<SuccessResponse, RevokeAllSessionsArgs | void>({
            query: (args) => ({
                url: "/auth/sessions",
                method: "DELETE",
                params:
                    typeof args === "object" && args
                        ? {includeCurrent: args.includeCurrent ?? false}
                        : undefined,
            }),
            invalidatesTags: ["UserSession"],
        }),
    }),
});

export const {
    useGetAuthSessionsQuery,
    useRevokeAuthSessionMutation,
    useRevokeAllAuthSessionsMutation,
} = authSessionsApi;
