import {skipToken} from "@reduxjs/toolkit/query";
import {renderHook} from "@testing-library/react";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {useCategoryPageController} from "./useCategoryPageController";

const testCtx = vi.hoisted(() => ({
    params: {slug: "phones", lng: "en"},
    resolveCategoryControllerMock: vi.fn(),
    breadcrumbsQueryMock: vi.fn(),
    localizedSlugSyncMock: vi.fn(),
}));

vi.mock("react-router", () => ({
    useParams: () => testCtx.params,
}));

vi.mock("@/entities/category", () => ({
    useResolvedCategoryIdController: (...args: unknown[]) =>
        testCtx.resolveCategoryControllerMock(...args),
    useGetCategoryBreadcrumbsQuery: (...args: unknown[]) => testCtx.breadcrumbsQueryMock(...args),
}));

vi.mock("@/shared/config", () => ({
    AppRoutes: {CATEGORY: "category"},
    routePaths: {
        category: "/:lng/category/:slug",
    },
}));

vi.mock("@/shared/lib", () => ({
    createControllerResult: <T>(value: T) => value,
}));

vi.mock("@/shared/lib", () => ({
    useLocalizedSlugSync: (...args: unknown[]) => testCtx.localizedSlugSyncMock(...args),
}));

describe("useCategoryPageController", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        testCtx.resolveCategoryControllerMock.mockReturnValue({
            data: {
                category: {id: "cat-1", slugMap: {en: "phones"}},
                resolvedCategoryId: "cat-1",
            },
            status: {isSuccess: true},
        });
        testCtx.breadcrumbsQueryMock.mockReturnValue({
            data: [{id: "root", name: "Root"}],
        });
    });

    test("loads breadcrumbs using resolved category id and syncs localized slug", () => {
        const {result} = renderHook(() => useCategoryPageController());

        expect(testCtx.resolveCategoryControllerMock).toHaveBeenCalledWith({
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
    });

    test("skips breadcrumbs query when category is unresolved", () => {
        testCtx.resolveCategoryControllerMock.mockReturnValue({
            data: {
                category: undefined,
                resolvedCategoryId: undefined,
            },
            status: {isSuccess: false},
        });

        renderHook(() => useCategoryPageController());

        expect(testCtx.breadcrumbsQueryMock).toHaveBeenCalledWith(skipToken);
    });
});

