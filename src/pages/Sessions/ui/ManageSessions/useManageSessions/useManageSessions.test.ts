import {act, renderHook} from "@testing-library/react";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {useManageSessions} from "./useManageSessions.ts";

const testCtx = vi.hoisted(() => ({
    dispatchMock: vi.fn(),
    navigateMock: vi.fn(),
    refetchMock: vi.fn(),
    clearUserSessionMock: vi.fn(),
    getSessionsQueryMock: vi.fn(),
    revokeSessionMutationMock: vi.fn(),
    revokeAllMutationMock: vi.fn(),
    extractApiErrorMessageMock: vi.fn((error: unknown) =>
        error instanceof Error ? error.message : "Request failed",
    ),
}));

vi.mock("react-router", () => ({
    useNavigate: () => testCtx.navigateMock,
}));

vi.mock("@/entities/user", () => ({
    clearUserSession: (...args: unknown[]) => testCtx.clearUserSessionMock(...args),
    useGetAuthSessionsQuery: () => testCtx.getSessionsQueryMock(),
    useRevokeAuthSessionMutation: () => testCtx.revokeSessionMutationMock(),
    useRevokeAllAuthSessionsMutation: () => testCtx.revokeAllMutationMock(),
}));

vi.mock("@/shared/lib/errors", () => ({
    extractApiErrorMessage: (error: unknown) => testCtx.extractApiErrorMessageMock(error),
}));

vi.mock("@/shared/lib/state", () => ({
    useAppDispatch: () => testCtx.dispatchMock,
}));

vi.mock("@/shared/lib/routing", () => ({
    useLocalizedRoutePath: () => (path: string) => path.replace(":lng", "en"),
}));

describe("useManageSessions", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        testCtx.refetchMock = vi.fn();
        testCtx.getSessionsQueryMock.mockReturnValue({
            data: [{id: "s1", userId: "u1", isCurrent: true}],
            isLoading: false,
            isFetching: false,
            error: undefined,
            refetch: testCtx.refetchMock,
        });
        testCtx.revokeSessionMutationMock.mockReturnValue([
            vi.fn(() => ({
                unwrap: vi.fn().mockResolvedValue({success: true}),
            })),
            {isLoading: false},
        ]);
        testCtx.revokeAllMutationMock.mockReturnValue([
            vi.fn(() => ({
                unwrap: vi.fn().mockResolvedValue({success: true}),
            })),
            {isLoading: false},
        ]);
    });

    test("returns query sessions and exposes retry action", () => {
        const {result} = renderHook(() => useManageSessions());

        expect(result.current.data.sessions).toEqual([{id: "s1", userId: "u1", isCurrent: true}]);
        expect(result.current.actions.retry).toBe(testCtx.refetchMock);
        expect(result.current.status.isLoading).toBe(false);
    });

    test("revokes current session and redirects to login", async () => {
        const revokeSession = vi.fn(() => ({
            unwrap: vi.fn().mockResolvedValue({success: true}),
        }));
        testCtx.revokeSessionMutationMock.mockReturnValue([revokeSession, {isLoading: false}]);

        const {result} = renderHook(() => useManageSessions());

        await act(async () => {
            await result.current.actions.revokeOne("s1", true);
        });

        expect(revokeSession).toHaveBeenCalledWith("s1");
        expect(testCtx.clearUserSessionMock).toHaveBeenCalledWith(testCtx.dispatchMock);
        expect(testCtx.navigateMock).toHaveBeenCalledWith("/en/login");
    });

    test("sets normalized error when revoke-all request fails", async () => {
        const revokeAll = vi.fn(() => ({
            unwrap: vi.fn().mockRejectedValue(new Error("Server error")),
        }));
        testCtx.revokeAllMutationMock.mockReturnValue([revokeAll, {isLoading: false}]);

        const {result} = renderHook(() => useManageSessions());

        await act(async () => {
            await result.current.actions.revokeAll(false);
        });

        expect(result.current.status.error).toBe("Server error");
        expect(testCtx.clearUserSessionMock).not.toHaveBeenCalled();
        expect(testCtx.navigateMock).not.toHaveBeenCalled();
    });
});
