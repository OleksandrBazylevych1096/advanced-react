import {baseAPI} from "@/shared/api";

import {
    applyAuthSession,
    type AuthSessionResponse,
    type MfaChallengeResponse,
} from "@/entities/user";

type LoginArgs = {
    identifier: string;
    password: string;
};

export const loginApi = baseAPI.injectEndpoints({
    endpoints: (build) => ({
        login: build.mutation<AuthSessionResponse | MfaChallengeResponse, LoginArgs>({
            query: (body) => ({
                url: "/auth/login",
                method: "POST",
                body,
            }),
            invalidatesTags: ["UserSession"],
            async onQueryStarted(_, {dispatch, queryFulfilled}) {
                try {
                    const {data} = await queryFulfilled;
                    if ("accessToken" in data && "user" in data) {
                        applyAuthSession(data, dispatch);
                    }
                } catch {
                    // Error is handled in UI.
                }
            },
        }),
    }),
});

export const {useLoginMutation} = loginApi;
