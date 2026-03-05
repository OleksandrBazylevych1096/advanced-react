import {act, renderHook} from "@testing-library/react";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {useToastNotificationListController} from "./useToastNotificationListController";

const testCtx = vi.hoisted(() => ({
    dispatchMock: vi.fn(),
    notifications: [] as Array<{id: string; message: string}>,
}));

vi.mock("@/shared/lib", () => ({
    createControllerResult: <T>(value: T) => value,
    useAppDispatch: () => testCtx.dispatchMock,
    useAppSelector: () => testCtx.notifications,
}));

vi.mock("../selectors/selectToastNotifications/selectToastNotifications", () => ({
    selectToastNotifications: vi.fn(),
}));

vi.mock("../slice/toastSlice", () => ({
    toastActions: {
        removeToast: (id: string) => ({type: "toast/removeToast", payload: id}),
    },
}));

describe("useToastNotificationListController", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        testCtx.notifications = [{id: "1", message: "hello"}];
    });

    test("returns notifications and removes toast via dispatch", () => {
        const {result} = renderHook(() => useToastNotificationListController());

        expect(result.current.data.notifications).toEqual(testCtx.notifications);

        act(() => {
            result.current.actions.removeToast("1");
        });

        expect(testCtx.dispatchMock).toHaveBeenCalledWith({
            type: "toast/removeToast",
            payload: "1",
        });
    });
});
