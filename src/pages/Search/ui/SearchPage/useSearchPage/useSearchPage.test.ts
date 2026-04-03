import {renderHook} from "@testing-library/react";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {useSearchPage} from "./useSearchPage.ts";

const testCtx = vi.hoisted(() => ({
    searchParams: new URLSearchParams(),
    getCategoryByIdQueryMock: vi.fn(),
}));

vi.mock("react-i18next", async (importOriginal) => {
    const actual = await importOriginal<typeof import("react-i18next")>();

    return {
        ...actual,
        useTranslation: () => ({i18n: {language: "en"}}),
    };
});

vi.mock("react-router", () => ({
    useSearchParams: () => [testCtx.searchParams],
    generatePath: () => "/en/search",
}));

vi.mock("@/entities/category", () => ({
    useGetCategoryByIdQuery: (...args: unknown[]) => testCtx.getCategoryByIdQueryMock(...args),
}));

vi.mock("@/shared/lib/state", () => ({}));

describe("useSearchPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        testCtx.searchParams = new URLSearchParams();
        testCtx.getCategoryByIdQueryMock.mockReturnValue({data: undefined});
    });

    test("returns invalid state for short query", () => {
        testCtx.searchParams = new URLSearchParams("q=a");

        const {result} = renderHook(() => useSearchPage());

        expect(result.current.data.searchQuery).toBe("a");
        expect(result.current.data.isValidSearch).toBe(false);
        expect(result.current.data.breadcrumbs).toEqual([]);

        expect(testCtx.getCategoryByIdQueryMock).toHaveBeenCalledWith(
            {id: "", locale: "en"},
            {skip: true},
        );
    });

    test("returns breadcrumbs with category when valid search and category are present", () => {
        testCtx.searchParams = new URLSearchParams("q=milk&categoryId=cat-1");
        testCtx.getCategoryByIdQueryMock.mockReturnValue({
            data: {name: "Dairy"},
        });

        const {result} = renderHook(() => useSearchPage());

        expect(result.current.data.searchQuery).toBe("milk");
        expect(result.current.data.activeCategoryId).toBe("cat-1");
        expect(result.current.data.isValidSearch).toBe(true);
        expect(result.current.data.breadcrumbs).toEqual([
            {label: "milk", href: "/en/search?q=milk"},
            {label: "Dairy"},
        ]);

        expect(testCtx.getCategoryByIdQueryMock).toHaveBeenCalledWith(
            {id: "cat-1", locale: "en"},
            {skip: false},
        );
    });
});
