import {skipToken} from "@reduxjs/toolkit/query";
import {renderHook} from "@testing-library/react";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {useResolvedCategoryIdController} from "./useResolvedCategoryIdController";

const testCtx = vi.hoisted(() => ({
    queryMock: vi.fn(),
}));

vi.mock("../../api/categoryApi", () => ({
    useGetCategoryBySlugQuery: (...args: unknown[]) => testCtx.queryMock(...args),
}));

describe("useResolvedCategoryIdController", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        testCtx.queryMock.mockReturnValue({
            currentData: {id: "cat-1"},
            isLoading: false,
            isSuccess: true,
            error: null,
        });
    });

    test("skips category query when categoryId is already provided", () => {
        const {result} = renderHook(() =>
            useResolvedCategoryIdController({
                categoryId: "cat-provided",
                slug: "phones",
                locale: "en",
            }),
        );

        expect(testCtx.queryMock).toHaveBeenCalledWith(skipToken);
        expect(result.current.data.resolvedCategoryId).toBe("cat-provided");
    });

    test("resolves category id by slug when categoryId is not provided", () => {
        const {result} = renderHook(() =>
            useResolvedCategoryIdController({slug: "phones", locale: "en"}),
        );

        expect(testCtx.queryMock).toHaveBeenCalledWith({slug: "phones", locale: "en"});
        expect(result.current.data.resolvedCategoryId).toBe("cat-1");
    });

    test("skips query when slug or locale is missing", () => {
        const {result} = renderHook(() => useResolvedCategoryIdController({slug: "phones"}));

        expect(testCtx.queryMock).toHaveBeenCalledWith(skipToken);
        expect(result.current.data.resolvedCategoryId).toBeUndefined();
    });
});
