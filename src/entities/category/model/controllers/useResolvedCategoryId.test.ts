import {skipToken} from "@reduxjs/toolkit/query";
import {renderHook} from "@testing-library/react";
import {describe, expect, test, vi} from "vitest";

import {useResolvedCategoryId} from "./useResolvedCategoryId";

const testCtx = vi.hoisted(() => ({
    getCategoryBySlugMock: vi.fn(),
}));

vi.mock("../../api/categoryApi", () => ({
    useGetCategoryBySlugQuery: (...args: unknown[]) => testCtx.getCategoryBySlugMock(...args),
}));

vi.mock("@/shared/lib/state", () => ({}));

describe("useResolvedCategoryId", () => {
    test("requests category by slug when id is not provided", () => {
        testCtx.getCategoryBySlugMock.mockReturnValue({
            currentData: {id: "cat-1"},
            isLoading: false,
            isSuccess: true,
            error: undefined,
        });

        const {result} = renderHook(() =>
            useResolvedCategoryId({
                slug: "phones",
                locale: "en",
            }),
        );

        expect(testCtx.getCategoryBySlugMock).toHaveBeenCalledWith({slug: "phones", locale: "en"});
        expect(result.current.data.resolvedCategoryId).toBe("cat-1");
    });

    test("uses provided category id without relying on resolved category data", () => {
        testCtx.getCategoryBySlugMock.mockReturnValue({
            currentData: undefined,
            isLoading: false,
            isSuccess: false,
            error: undefined,
        });

        const {result} = renderHook(() => useResolvedCategoryId({categoryId: "cat-1"}));

        expect(result.current.data.resolvedCategoryId).toBe("cat-1");
    });

    test("returns undefined resolved id when slug data is unavailable", () => {
        testCtx.getCategoryBySlugMock.mockReturnValue({
            currentData: undefined,
            isLoading: false,
            isSuccess: false,
            error: undefined,
        });

        const {result} = renderHook(() => useResolvedCategoryId({slug: "phones"}));

        expect(result.current.data.resolvedCategoryId).toBeUndefined();
    });

    test("skips category lookup when explicitly disabled", () => {
        testCtx.getCategoryBySlugMock.mockReturnValue({
            currentData: undefined,
            isLoading: false,
            isSuccess: false,
            error: undefined,
        });

        renderHook(() =>
            useResolvedCategoryId({
                slug: "phones",
                locale: "en",
                skip: true,
            }),
        );

        expect(testCtx.getCategoryBySlugMock).toHaveBeenCalledWith(skipToken);
    });
});
