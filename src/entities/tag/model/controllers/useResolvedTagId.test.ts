import {skipToken} from "@reduxjs/toolkit/query";
import {renderHook} from "@testing-library/react";
import {describe, expect, test, vi} from "vitest";

import {useResolvedTagId} from "./useResolvedTagId";

const testCtx = vi.hoisted(() => ({
    getTagBySlugMock: vi.fn(),
}));

vi.mock("../../api/tagApi", () => ({
    useGetTagBySlugQuery: (...args: unknown[]) => testCtx.getTagBySlugMock(...args),
}));

vi.mock("@/shared/lib/state", () => ({}));

describe("useResolvedTagId", () => {
    test("requests tag by slug when id is not provided", () => {
        testCtx.getTagBySlugMock.mockReturnValue({
            currentData: {id: "tag-1"},
            isLoading: false,
            isSuccess: true,
            error: undefined,
        });

        const {result} = renderHook(() =>
            useResolvedTagId({
                slug: "organic",
                locale: "en",
            }),
        );

        expect(testCtx.getTagBySlugMock).toHaveBeenCalledWith({slug: "organic", locale: "en"});
        expect(result.current.data.resolvedTagId).toBe("tag-1");
    });

    test("uses provided tag id without relying on resolved tag data", () => {
        testCtx.getTagBySlugMock.mockReturnValue({
            currentData: undefined,
            isLoading: false,
            isSuccess: false,
            error: undefined,
        });

        const {result} = renderHook(() => useResolvedTagId({tagId: "tag-1"}));

        expect(result.current.data.resolvedTagId).toBe("tag-1");
    });

    test("skips the query when slug context is missing", () => {
        testCtx.getTagBySlugMock.mockReturnValue({
            currentData: undefined,
            isLoading: false,
            isSuccess: false,
            error: undefined,
        });

        renderHook(() => useResolvedTagId({locale: "en"}));

        expect(testCtx.getTagBySlugMock).toHaveBeenCalledWith(skipToken);
    });
});
