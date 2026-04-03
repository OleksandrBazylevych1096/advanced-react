import {beforeEach, describe, expect, test, vi} from "vitest";

import {applySearchQuery} from "./applySearchQuery";

const testCtx = vi.hoisted(() => ({
    dispatchMock: vi.fn(),
    navigateMock: vi.fn(),
}));

describe("applySearchQuery", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("dispatches query actions, closes dropdown and navigates", () => {
        applySearchQuery({
            query: "  milk  ",
            dispatch: testCtx.dispatchMock,
            navigate: testCtx.navigateMock,
            locale: "en",
        });

        expect(testCtx.dispatchMock).toHaveBeenNthCalledWith(1, {
            type: "productSearch/setQuery",
            payload: "milk",
        });
        expect(testCtx.dispatchMock).toHaveBeenNthCalledWith(2, {
            type: "productSearch/submitQuery",
            payload: "milk",
        });
        expect(testCtx.dispatchMock).toHaveBeenNthCalledWith(3, {
            type: "productSearch/setFocused",
            payload: false,
        });
        expect(testCtx.navigateMock).toHaveBeenCalledWith("/en/search?q=milk");
    });

    test("does nothing for empty query", () => {
        applySearchQuery({
            query: "   ",
            dispatch: testCtx.dispatchMock,
            navigate: testCtx.navigateMock,
            locale: "en",
        });

        expect(testCtx.dispatchMock).not.toHaveBeenCalled();
        expect(testCtx.navigateMock).not.toHaveBeenCalled();
    });
});
