import {
    type BaseQueryFn,
    type FetchArgs,
    fetchBaseQuery,
    type FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

import {API_URL} from "@/shared/config";

type BaseQueryWithReauthConfig<TSession = unknown> = {
    selectAccessToken: (state: StateSchema) => string | null | undefined;
    applyAuthSession: (data: TSession, dispatch: AppDispatch) => void;
    clearUserSession: (dispatch: AppDispatch) => void;
};

const defaultReauthConfig: BaseQueryWithReauthConfig = {
    selectAccessToken: () => undefined,
    applyAuthSession: () => {},
    clearUserSession: () => {},
};

let reauthConfig = defaultReauthConfig;

export const configureBaseQueryWithReauth = <TSession>(
    config: BaseQueryWithReauthConfig<TSession>,
) => {
    reauthConfig = {
        selectAccessToken: config.selectAccessToken,
        applyAuthSession: (data, dispatch) => config.applyAuthSession(data as TSession, dispatch),
        clearUserSession: config.clearUserSession,
    };
};

const rawBaseQuery = fetchBaseQuery({
    baseUrl: API_URL,
    credentials: "include",
    prepareHeaders: (headers, {getState}) => {
        const accessToken = reauthConfig.selectAccessToken(getState() as StateSchema);

        if (accessToken) {
            headers.set("Authorization", `Bearer ${accessToken}`);
        }

        return headers;
    },
});

const getRequestUrl = (args: string | FetchArgs) => {
    return typeof args === "string" ? args : args.url;
};

const isAuthRefreshRequest = (args: string | FetchArgs) => {
    const url = getRequestUrl(args);
    return url.includes("/auth/refresh");
};

const isAuthRequest = (args: string | FetchArgs) => {
    const url = getRequestUrl(args);
    return url.includes("/auth/");
};

let refreshPromise: Promise<
    {ok: true; data: unknown} | {ok: false; error?: FetchBaseQueryError}
> | null = null;

const runRefresh = async (
    api: Parameters<BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>>[1],
    extraOptions: Parameters<BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>>[2],
) => {
    const refreshResult = await rawBaseQuery(
        {url: "/auth/refresh", method: "POST"},
        api,
        extraOptions,
    );

    if (refreshResult.data) {
        const data = refreshResult.data;
        reauthConfig.applyAuthSession(data, api.dispatch as AppDispatch);
        return {ok: true as const, data};
    }

    reauthConfig.clearUserSession(api.dispatch as AppDispatch);
    return {ok: false as const, error: refreshResult.error};
};

export const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    if (isAuthRefreshRequest(args)) {
        if (!refreshPromise) {
            refreshPromise = runRefresh(api, extraOptions).finally(() => {
                refreshPromise = null;
            });
        }

        const refreshStatus = await refreshPromise;
        if (refreshStatus.ok) {
            return {data: refreshStatus.data};
        }

        return {error: refreshStatus.error ?? {status: "CUSTOM_ERROR", error: "Refresh failed"}};
    }

    let result = await rawBaseQuery(args, api, extraOptions);

    if (result.error?.status !== 401) {
        return result;
    }

    const accessToken = reauthConfig.selectAccessToken(api.getState() as StateSchema);
    if (!accessToken || isAuthRequest(args)) {
        return result;
    }

    if (!refreshPromise) {
        refreshPromise = runRefresh(api, extraOptions).finally(() => {
            refreshPromise = null;
        });
    }

    const refreshStatus = await refreshPromise;
    if (!refreshStatus.ok) {
        return result;
    }

    result = await rawBaseQuery(args, api, extraOptions);

    if (result.error?.status === 401) {
        reauthConfig.clearUserSession(api.dispatch as AppDispatch);
    }

    return result;
};
