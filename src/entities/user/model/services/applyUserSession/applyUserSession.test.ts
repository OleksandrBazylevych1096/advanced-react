import {beforeEach, describe, expect, test, vi} from "vitest";

import {AuthProviders, LOCAL_STORAGE_USER_KEY} from "@/shared/config";

import {applyAuthSession, applyUserSession} from "./applyUserSession";

describe("applyUserSession services", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    test("applyUserSession stores user in localStorage and dispatches setUserData", () => {
        const dispatchMock = vi.fn();
        const user = {
            id: "u1",
            email: "john@example.com",
            provider: AuthProviders.LOCAL,
        };

        applyUserSession(user, dispatchMock);

        expect(localStorage.getItem(LOCAL_STORAGE_USER_KEY)).toBe(JSON.stringify(user));
        expect(dispatchMock).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenCalledWith({
            type: "user/setUserData",
            payload: user,
        });
    });

    test("applyAuthSession stores user and dispatches auth-related actions", () => {
        const dispatchMock = vi.fn();
        const session = {
            accessToken: "token-1",
            accessTokenExpiresAt: "2099-01-01T00:00:00.000Z",
            user: {
                id: "u1",
                provider: AuthProviders.LOCAL,
            },
        };

        applyAuthSession(session, dispatchMock);

        expect(localStorage.getItem(LOCAL_STORAGE_USER_KEY)).toBe(JSON.stringify(session.user));
        expect(dispatchMock).toHaveBeenNthCalledWith(1, {type: "user/clearPendingMfaChallenge"});
        expect(dispatchMock).toHaveBeenNthCalledWith(2, {
            type: "user/setAccessToken",
            payload: {
                accessToken: "token-1",
                accessTokenExpiresAt: "2099-01-01T00:00:00.000Z",
            },
        });
        expect(dispatchMock).toHaveBeenNthCalledWith(3, {
            type: "user/setUserData",
            payload: session.user,
        });
    });
});
