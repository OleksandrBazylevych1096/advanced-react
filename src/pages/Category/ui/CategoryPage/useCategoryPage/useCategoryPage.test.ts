import {skipToken} from "@reduxjs/toolkit/query";
import {renderHook} from "@testing-library/react";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {useCategoryPage} from "./useCategoryPage.ts";

const testCtx = vi.hoisted(() => ({
    params: {slug: "phones", lng: "en"},
    resolveCategoryIdMock: vi.fn(),
    breadcrumbsQueryMock: vi.fn(),
    localizedSlugSyncMock: vi.fn(),
}));

vi.mock("react-router", () => ({
    useParams: () => testCtx.params,
}));

vi.mock("@/entities/category", () => ({
    useResolvedCategoryId: (...args: unknown[]) => testCtx.resolveCategoryIdMock(...args),
    useGetCategoryBreadcrumbsQuery: (...args: unknown[]) => testCtx.breadcrumbsQueryMock(...args),
}));

vi.mock("@/shared/config", () => ({
    AppRoutes: {CATEGORY: "category"},
    routePaths: {
        category: "/:lng/category/:slug",
    },
}));

vi.mock("@/shared/lib/state", () => ({}));

vi.mock("@/shared/lib/routing", () => ({
    useLocalizedSlugSync: (...args: unknown[]) => testCtx.localizedSlugSyncMock(...args),
}));

describe("useCategoryPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        testCtx.resolveCategoryIdMock.mockReturnValue({
            data: {
                category: {id: "cat-1", slugMap: {en: "phones"}},
                resolvedCategoryId: "cat-1",
            },
            status: {isLoading: false, isSuccess: true},
        });
        testCtx.breadcrumbsQueryMock.mockReturnValue({
            data: [{id: "root", name: "Root"}],
        });
    });

    test("loads breadcrumbs using resolved category id and syncs localized slug", () => {
        const {result} = renderHook(() => useCategoryPage());

        expect(testCtx.resolveCategoryIdMock).toHaveBeenCalledWith({
            slug: "phones",
            locale: "en",
        });
        expect(testCtx.breadcrumbsQueryMock).toHaveBeenCalledWith({id: "cat-1", locale: "en"});
        expect(testCtx.localizedSlugSyncMock).toHaveBeenCalledWith({
            languageParam: "en",
            slugMap: {en: "phones"},
            enabled: true,
            routePath: "/:lng/category/:slug",
        });
        expect(result.current.data).toEqual({
            breadcrumbs: [{id: "root", name: "Root"}],
            categoryId: "cat-1",
        });
        expect(result.current.status).toEqual({
            isLoading: false,
        });
    });

    test("skips breadcrumbs query when category is unresolved", () => {
        testCtx.resolveCategoryIdMock.mockReturnValue({
            data: {
                category: undefined,
                resolvedCategoryId: undefined,
            },
            status: {isLoading: true, isSuccess: false},
        });

        renderHook(() => useCategoryPage());

        expect(testCtx.breadcrumbsQueryMock).toHaveBeenCalledWith(skipToken);
    });
});
