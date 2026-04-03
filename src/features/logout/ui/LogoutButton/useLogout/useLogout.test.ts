import {act, renderHook} from "@testing-library/react";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {useLogout} from "./useLogout.ts";

const testCtx = vi.hoisted(() => ({
    logoutRequestMock: vi.fn(),
    isLoading: false,
}));

vi.mock("../../../api/logoutApi.ts", () => ({
    useLogoutMutation: () => [testCtx.logoutRequestMock, {isLoading: testCtx.isLoading}],
}));

vi.mock("@/shared/lib", () => ({}));

describe("useLogout", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        testCtx.isLoading = false;
        testCtx.logoutRequestMock.mockReturnValue(Promise.resolve({}));
    });

    test("exposes loading status and calls logout request action", () => {
        const {result} = renderHook(() => useLogout());

        expect(result.current.status.isLoading).toBe(false);

        act(() => {
            result.current.actions.logout();
        });

        expect(testCtx.logoutRequestMock).toHaveBeenCalledTimes(1);
    });
});
