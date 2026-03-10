import {clearUserSession} from "@/entities/user";

import {baseAPI} from "@/shared/api";

export const logoutApi = baseAPI.injectEndpoints({
    endpoints: (build) => ({
        logout: build.mutation<void, void>({
            query: () => ({
                url: "/auth/logout",
                method: "POST",
            }),
            async onQueryStarted(_, {dispatch, queryFulfilled}) {
                clearUserSession(dispatch);
                void queryFulfilled.catch(() => undefined);
            },
        }),
    }),
});

export const {useLogoutMutation} = logoutApi;
