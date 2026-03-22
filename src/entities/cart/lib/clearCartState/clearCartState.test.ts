import {beforeEach, describe, expect, test, vi} from "vitest";

import {clearCartState} from "./clearCartState";

const testCtx = vi.hoisted(() => ({
    clearCartActionMock: vi.fn(() => ({type: "cart/clearCart"})),
    clearGuestCartMock: vi.fn(),
    broadcastCartClearMock: vi.fn(),
    invalidateTagsMock: vi.fn(() => ({type: "baseAPI/invalidateTags"})),
    dispatchMock: vi.fn(),
}));

vi.mock("../../state/slice/cartSlice", () => ({
    cartActions: {
        clearCart: testCtx.clearCartActionMock,
    },
}));

vi.mock("../cartStorage", () => ({
    clearGuestCart: testCtx.clearGuestCartMock,
}));

vi.mock("../cartSync", () => ({
    broadcastCartClear: testCtx.broadcastCartClearMock,
}));

vi.mock("../../api/cartApi", () => ({
    cartApi: {
        util: {
            invalidateTags: testCtx.invalidateTagsMock,
        },
    },
}));

describe("clearCartState", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        testCtx.clearCartActionMock.mockReturnValue({type: "cart/clearCart"});
        testCtx.invalidateTagsMock.mockReturnValue({type: "baseAPI/invalidateTags"});
    });

    test("clears cart state with default options", () => {
        clearCartState(testCtx.dispatchMock);

        expect(testCtx.clearCartActionMock).toHaveBeenCalledTimes(1);
        expect(testCtx.clearGuestCartMock).toHaveBeenCalledTimes(1);
        expect(testCtx.broadcastCartClearMock).toHaveBeenCalledTimes(1);
        expect(testCtx.invalidateTagsMock).not.toHaveBeenCalled();
        expect(testCtx.dispatchMock).toHaveBeenCalledWith({type: "cart/clearCart"});
    });

    test("invalidates cart tags when option is enabled", () => {
        clearCartState(testCtx.dispatchMock, {invalidateCartTags: true});

        expect(testCtx.invalidateTagsMock).toHaveBeenCalledWith(["Cart", "CartValidation"]);
        expect(testCtx.dispatchMock).toHaveBeenCalledWith({type: "baseAPI/invalidateTags"});
    });
});

