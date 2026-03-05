import {baseAPI} from "@/shared/api";

import {applyAuthSession} from "../model/services/applyUserSession/applyUserSession";
import {clearUserSession} from "../model/services/clearUserSession/clearUserSession";
import type {AuthSessionResponse} from "../model/types/AuthSession";

export const sessionApi = baseAPI.injectEndpoints({
    endpoints: (build) => ({
        refreshSession: build.mutation<AuthSessionResponse, void>({
            query: () => ({
                url: "/auth/refresh",
                method: "POST",
            }),
            invalidatesTags: ["UserSession"],
            async onQueryStarted(_, {dispatch, queryFulfilled}) {
                try {
                    const {data} = await queryFulfilled;
                    applyAuthSession(data, dispatch);
                } catch {
                    clearUserSession(dispatch);
                }
            },
        }),
        logout: build.mutation<void, void>({
            query: () => ({
                url: "/auth/logout",
                method: "POST",
            }),
            async onQueryStarted(_, {dispatch, queryFulfilled}) {
                clearUserSession(dispatch);
                try {
                    await queryFulfilled;
                } catch {}
            },
        }),
    }),
});

export const {useRefreshSessionMutation, useLogoutMutation} = sessionApi;
