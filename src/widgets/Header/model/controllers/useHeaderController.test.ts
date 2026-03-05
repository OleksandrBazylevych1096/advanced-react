import {act, renderHook} from "@testing-library/react";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {useHeaderController} from "./useHeaderController";

const testCtx = vi.hoisted(() => ({
    dispatchMock: vi.fn(),
    state: undefined as StateSchema | undefined,
}));

vi.mock("@/entities/user", () => ({
    logout: () => ({type: "user/logout"}),
    selectUserData: (state: StateSchema) => state.user?.userData,
}));

vi.mock("@/shared/lib", () => ({
    createControllerResult: <T>(value: T) => value,
    useAppDispatch: () => testCtx.dispatchMock,
    useAppSelector: (selector: (state: StateSchema) => unknown) =>
        selector(testCtx.state as StateSchema),
}));

describe("useHeaderController", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        testCtx.state = {user: {userData: {id: "u1", email: "u@test.com"}}} as StateSchema;
    });

    test("returns user and dispatches logout", () => {
        const {result} = renderHook(() => useHeaderController());

        expect(result.current.data.user).toEqual({id: "u1", email: "u@test.com"});

        act(() => {
            result.current.actions.logout();
        });

        expect(testCtx.dispatchMock).toHaveBeenCalledWith({type: "user/logout"});
    });
});
