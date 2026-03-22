import {act, renderHook} from "@testing-library/react";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {useSetupTwoFactorController} from "./useSetupTwoFactorController";

const testCtx = vi.hoisted(() => ({
    userData: {
        id: "user-1",
        provider: "LOCAL",
        email: "john@example.com",
        isTwoFactorEnabled: false,
    },
    dispatchMock: vi.fn(),
    setupTwoFactorMutationMock: vi.fn(),
    enableTwoFactorMutationMock: vi.fn(),
    extractApiErrorMessageMock: vi.fn(() => "Request failed"),
}));

vi.mock("@/entities/user", () => ({
    selectUserData: () => testCtx.userData,
    userActions: {
        setUserData: (payload: unknown) => ({type: "user/setUserData", payload}),
    },
}));

vi.mock("@/shared/lib", () => ({
    createControllerResult: <T>(value: T) => value,
    useAppDispatch: () => testCtx.dispatchMock,
    useAppSelector: (selector: (state: unknown) => unknown) => selector({}),
}));

vi.mock("@/shared/lib/errors", () => ({
    extractApiErrorMessage: (...args: unknown[]) => testCtx.extractApiErrorMessageMock(...args),
}));

vi.mock("../../api/setupTwoFactorApi", () => ({
    useSetupTwoFactorMutation: () => [testCtx.setupTwoFactorMutationMock, {isLoading: false}],
    useEnableTwoFactorMutation: () => [testCtx.enableTwoFactorMutationMock, {isLoading: false}],
}));

describe("useSetupTwoFactorController", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        testCtx.userData = {
            id: "user-1",
            provider: "LOCAL",
            email: "john@example.com",
            isTwoFactorEnabled: false,
        };
        testCtx.setupTwoFactorMutationMock.mockReturnValue({
            unwrap: vi.fn().mockResolvedValue({
                qrCodeDataUrl: "data:image/png;base64,abc",
                backupCodes: ["AAA111", "BBB222"],
            }),
        });
        testCtx.enableTwoFactorMutationMock.mockReturnValue({
            unwrap: vi.fn().mockResolvedValue({success: true}),
        });
    });

    test("changeCode keeps only digits and limits length to 6", () => {
        const {result} = renderHook(() => useSetupTwoFactorController());

        act(() => {
            result.current.actions.changeCode("12a3b4c56789");
        });

        expect(result.current.data.code).toBe("123456");
    });

    test("startSetup loads QR and backup codes", async () => {
        const {result} = renderHook(() => useSetupTwoFactorController());

        await act(async () => {
            await result.current.actions.startSetup();
        });

        expect(testCtx.setupTwoFactorMutationMock).toHaveBeenCalledTimes(1);
        expect(result.current.data.setupData).toEqual({
            qrCodeDataUrl: "data:image/png;base64,abc",
            backupCodes: ["AAA111", "BBB222"],
        });
    });

    test("enable updates user data in store for valid code", async () => {
        const {result} = renderHook(() => useSetupTwoFactorController());

        act(() => {
            result.current.actions.changeCode("123456");
        });
        await act(async () => {
            await result.current.actions.enable();
        });

        expect(testCtx.enableTwoFactorMutationMock).toHaveBeenCalledWith({code: "123456"});
        expect(testCtx.dispatchMock).toHaveBeenCalledWith({
            type: "user/setUserData",
            payload: expect.objectContaining({isTwoFactorEnabled: true}),
        });
        expect(result.current.data.isEnabled).toBe(true);
    });
});
