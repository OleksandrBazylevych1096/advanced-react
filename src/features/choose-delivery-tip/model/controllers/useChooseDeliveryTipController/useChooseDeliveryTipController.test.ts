import {act, renderHook} from "@testing-library/react";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {useChooseDeliveryTipController} from "./useChooseDeliveryTipController";

const testCtx = vi.hoisted(() => ({
    state: undefined as StateSchema | undefined,
    dispatchMock: vi.fn(),
}));

vi.mock("@/entities/user", () => ({
    selectUserCurrency: () => "USD",
}));

vi.mock("@/shared/lib/async/debounce/useDebounce.ts", () => ({
    useDebounce: (value: string) => value,
}));

vi.mock("@/shared/lib", () => ({
    createControllerResult: <T>(value: T) => value,
    useAppDispatch: () => testCtx.dispatchMock,
    useAppSelector: (selector: (state: StateSchema) => unknown) =>
        selector(testCtx.state as StateSchema),
}));

describe("useChooseDeliveryTipController", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        testCtx.state = {
            chooseDeliveryTip: {amount: 0},
        } as StateSchema;
    });

    test("dispatches setAmount when preset tip is selected", () => {
        const {result} = renderHook(() => useChooseDeliveryTipController());

        act(() => {
            result.current.actions.selectPresetTip(10);
        });

        expect(testCtx.dispatchMock).toHaveBeenCalledWith({
            payload: 10,
            type: "chooseDeliveryTip/setAmount",
        });
    });

    test("deselects preset tip when clicking the same preset", () => {
        testCtx.state = {
            chooseDeliveryTip: {amount: 10},
        } as StateSchema;

        const {result} = renderHook(() => useChooseDeliveryTipController());

        act(() => {
            result.current.actions.selectPresetTip(10);
        });

        expect(testCtx.dispatchMock).toHaveBeenCalledWith({
            payload: 0,
            type: "chooseDeliveryTip/setAmount",
        });
    });

    test("deselects other mode when clicking Other again", () => {
        testCtx.state = {
            chooseDeliveryTip: {amount: 7},
        } as StateSchema;

        const {result} = renderHook(() => useChooseDeliveryTipController());

        act(() => {
            result.current.actions.selectCustomTip();
        });

        act(() => {
            result.current.actions.selectCustomTip();
        });

        expect(testCtx.dispatchMock).toHaveBeenCalledWith({
            payload: 0,
            type: "chooseDeliveryTip/setAmount",
        });
    });
});
