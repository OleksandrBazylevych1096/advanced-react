import {beforeEach, describe, expect, test, vi} from "vitest";

import {LOCAL_STORAGE_USER_KEY} from "@/shared/config";

import {clearUserSession} from "./clearUserSession";

describe("clearUserSession", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    test("removes user from localStorage and dispatches clearing actions", () => {
        const dispatchMock = vi.fn();
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify({id: "u1"}));

        clearUserSession(dispatchMock);

        expect(localStorage.getItem(LOCAL_STORAGE_USER_KEY)).toBeNull();
        expect(dispatchMock).toHaveBeenNthCalledWith(1, {type: "user/clearPendingMfaChallenge"});
        expect(dispatchMock).toHaveBeenNthCalledWith(2, {type: "user/clearAccessToken"});
        expect(dispatchMock).toHaveBeenNthCalledWith(3, {type: "user/clearUserData"});
        expect(dispatchMock).toHaveBeenCalledTimes(3);
    });
});
