import {skipToken} from "@reduxjs/toolkit/query";
import {renderHook} from "@testing-library/react";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {useProductPage} from "./useProductPage.ts";

const testCtx = vi.hoisted(() => ({
    params: {slug: "iphone-15", lng: "en"},
    productBySlugQueryMock: vi.fn(),
    categoryBreadcrumbsQueryMock: vi.fn(),
    generateProductBreadcrumbsMock: vi.fn(),
    localizedSlugSyncMock: vi.fn(),
}));

vi.mock("react-router", () => ({
    useParams: () => testCtx.params,
}));

vi.mock("@/pages/Product/api/productPageApi.ts", () => ({
    useGetProductBySlugQuery: (...args: unknown[]) => testCtx.productBySlugQueryMock(...args),
}));

vi.mock("@/pages/Product/lib/generateProductBreadcrumbs/generateProductBreadcrumbs.ts", () => ({
    generateProductBreadcrumbs: (...args: unknown[]) =>
        testCtx.generateProductBreadcrumbsMock(...args),
}));

vi.mock("@/entities/category", () => ({
    useGetCategoryBreadcrumbsQuery: (...args: unknown[]) =>
        testCtx.categoryBreadcrumbsQueryMock(...args),
}));

vi.mock("@/shared/config", () => ({
    AppRoutes: {PRODUCT: "product"},
    routePaths: {
        product: "/:lng/product/:slug",
    },
}));

vi.mock("@/shared/lib/state", () => ({}));

vi.mock("@/shared/lib/routing", () => ({
    useLocalizedSlugSync: (...args: unknown[]) => testCtx.localizedSlugSyncMock(...args),
}));

describe("useProductPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        testCtx.productBySlugQueryMock.mockReturnValue({
            data: {
                id: "p1",
                name: "iPhone 15",
                categoryId: "cat-1",
                slugMap: {en: "iphone-15"},
            },
            isSuccess: true,
            isFetching: false,
            isError: false,
        });
        testCtx.categoryBreadcrumbsQueryMock.mockReturnValue({
            data: [{id: "cat-1", name: "Phones"}],
        });
        testCtx.generateProductBreadcrumbsMock.mockReturnValue([
            {id: "cat-1", name: "Phones"},
            {id: "p1", name: "iPhone 15"},
        ]);
    });

    test("loads product, breadcrumbs and syncs localized slug", () => {
        const {result} = renderHook(() => useProductPage());

        expect(testCtx.productBySlugQueryMock).toHaveBeenCalledWith({
            slug: "iphone-15",
            locale: "en",
        });
        expect(testCtx.categoryBreadcrumbsQueryMock).toHaveBeenCalledWith({
            id: "cat-1",
            locale: "en",
        });
        expect(testCtx.generateProductBreadcrumbsMock).toHaveBeenCalledWith(
            [{id: "cat-1", name: "Phones"}],
            "iPhone 15",
        );
        expect(testCtx.localizedSlugSyncMock).toHaveBeenCalledWith({
            languageParam: "en",
            slugMap: {en: "iphone-15"},
            enabled: true,
            routePath: "/:lng/product/:slug",
        });
        expect(result.current.data.product?.id).toBe("p1");
        expect(result.current.derived.breadcrumbs).toEqual([
            {id: "cat-1", name: "Phones"},
            {id: "p1", name: "iPhone 15"},
        ]);
    });

    test("uses skipToken when slug or locale is missing", () => {
        testCtx.params = {slug: undefined, lng: "en"} as unknown as {slug: string; lng: string};
        testCtx.productBySlugQueryMock.mockReturnValue({
            data: undefined,
            isSuccess: false,
            isFetching: false,
            isError: false,
        });

        renderHook(() => useProductPage());

        expect(testCtx.productBySlugQueryMock).toHaveBeenCalledWith(skipToken);
    });
});
