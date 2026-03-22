import {baseAPI} from "@/shared/api";

import {applyAuthSession} from "../../state/services/applyUserSession/applyUserSession";
import {clearUserSession} from "../../state/services/clearUserSession/clearUserSession";
import type {AuthSessionResponse} from "../../state/types/AuthSession";

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
    }),
});

export const {useRefreshSessionMutation} = sessionApi;

