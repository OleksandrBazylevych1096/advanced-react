import {act, renderHook} from "@testing-library/react";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {useCatalogController} from "./useCatalogController";

const testCtx = vi.hoisted(() => ({
    state: undefined as StateSchema | undefined,
    categoryQueryMock: vi.fn(),
    infiniteProductsMock: vi.fn(),
    fetchNextPageMock: vi.fn(),
    refetchMock: vi.fn(),
}));

vi.mock("react-router", () => ({
    useParams: () => ({slug: "phones", lng: "en"}),
}));

vi.mock("react-i18next", () => ({
    useTranslation: () => ({i18n: {language: "en"}}),
}));

vi.mock("@/features/product-filters", () => ({
    selectActiveFilters: (state: StateSchema) => state.productFilters?.activeFilters ?? {},
}));

vi.mock("@/entities/category", () => ({
    useGetCategoryBySlugQuery: (...args: unknown[]) => testCtx.categoryQueryMock(...args),
}));

vi.mock("@/entities/product", () => ({
    useGetInfiniteProducts: (...args: unknown[]) => testCtx.infiniteProductsMock(...args),
}));

vi.mock("@/entities/user", () => ({
    selectUserCurrency: (state: StateSchema) => state.user?.currency,
}));

vi.mock("@/shared/lib", () => ({
    createControllerResult: <T>(value: T) => value,
    useAppSelector: (selector: (state: StateSchema) => unknown) =>
        selector(testCtx.state as StateSchema),
}));

describe("useCatalogController", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        testCtx.state = {
            user: {currency: "USD"},
            productFilters: {activeFilters: {brands: ["Apple"]}},
        } as StateSchema;
        testCtx.fetchNextPageMock = vi.fn().mockResolvedValue(undefined);
        testCtx.refetchMock = vi.fn();
        testCtx.categoryQueryMock.mockReturnValue({currentData: {id: "cat-1"}});
        testCtx.infiniteProductsMock.mockReturnValue({
            data: {pages: [{products: [{id: "p1"}]}]},
            isLoading: false,
            isFetching: false,
            error: null,
            isFetchingNextPage: false,
            hasNextPage: true,
            fetchNextPage: testCtx.fetchNextPageMock,
            refetch: testCtx.refetchMock,
        });
    });

    test("returns products and loads more near list end", async () => {
        const {result} = renderHook(() => useCatalogController());

        expect(testCtx.categoryQueryMock).toHaveBeenCalledWith(
            {slug: "phones", locale: "en"},
            {skip: false},
        );
        expect(testCtx.infiniteProductsMock).toHaveBeenCalledWith(
            {
                categoryId: "cat-1",
                locale: "en",
                currency: "USD",
                brands: ["Apple"],
            },
            {skip: false},
        );
        expect(result.current.data.products).toEqual([{id: "p1"}]);
        expect(result.current.actions.refetch).toBe(testCtx.refetchMock);

        await act(async () => {
            result.current.actions.loadMore({rowsCount: 20, stopIndex: 19});
            await Promise.resolve();
        });

        expect(testCtx.fetchNextPageMock).toHaveBeenCalledTimes(1);
    });

    test("does not load more when already fetching next page", () => {
        testCtx.infiniteProductsMock.mockReturnValue({
            data: {pages: [{products: [{id: "p1"}]}]},
            isLoading: false,
            isFetching: true,
            error: null,
            isFetchingNextPage: true,
            hasNextPage: true,
            fetchNextPage: testCtx.fetchNextPageMock,
            refetch: testCtx.refetchMock,
        });

        const {result} = renderHook(() => useCatalogController());

        act(() => {
            result.current.actions.loadMore({rowsCount: 20, stopIndex: 19});
        });

        expect(testCtx.fetchNextPageMock).not.toHaveBeenCalled();
    });

    test("uses provided category context and skips slug category lookup", () => {
        renderHook(() => useCatalogController({categoryId: "cat-1"}));

        expect(testCtx.categoryQueryMock).toHaveBeenCalledWith(
            {slug: "phones", locale: "en"},
            {skip: true},
        );
        expect(testCtx.infiniteProductsMock).toHaveBeenCalledWith(
            {
                categoryId: "cat-1",
                locale: "en",
                currency: "USD",
                brands: ["Apple"],
            },
            {skip: false},
        );
    });
});
