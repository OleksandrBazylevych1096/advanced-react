import {act, renderHook} from "@testing-library/react";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {useLogoutController} from "./useLogoutController";

const testCtx = vi.hoisted(() => ({
    logoutRequestMock: vi.fn(),
    isLoading: false,
}));

vi.mock("../../api/logoutApi", () => ({
    useLogoutMutation: () => [testCtx.logoutRequestMock, {isLoading: testCtx.isLoading}],
}));

vi.mock("@/shared/lib", () => ({
    createControllerResult: <T>(value: T) => value,
}));

describe("useLogoutController", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        testCtx.isLoading = false;
        testCtx.logoutRequestMock.mockReturnValue(Promise.resolve({}));
    });

    test("exposes loading status and calls logout request action", () => {
        const {result} = renderHook(() => useLogoutController());

        expect(result.current.status.isLoading).toBe(false);

        act(() => {
            result.current.actions.logout();
        });

        expect(testCtx.logoutRequestMock).toHaveBeenCalledTimes(1);
    });
});

