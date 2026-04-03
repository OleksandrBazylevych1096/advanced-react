import {act, renderHook} from "@testing-library/react";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {useCatalog} from "./useCatalog.ts";

const testCtx = vi.hoisted(() => ({
    state: undefined as StateSchema | undefined,
    resolvedCategoryIdMock: vi.fn(),
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
    selectActiveFilters: (state: StateSchema) => ({
        brands: state.productFilters?.filters.brands ?? [],
        countries: state.productFilters?.filters.countries ?? [],
        minPrice: state.productFilters?.filters.priceRange.min,
        maxPrice: state.productFilters?.filters.priceRange.max,
        inStock: state.productFilters?.filters.inStock ?? true,
        sortBy: state.productFilters?.filters.sortBy ?? "price",
        sortOrder: state.productFilters?.filters.sortOrder ?? "asc",
    }),
}));

vi.mock("@/entities/category", () => ({
    useResolvedCategoryId: (...args: unknown[]) => testCtx.resolvedCategoryIdMock(...args),
}));

vi.mock("@/entities/product", () => ({
    useGetInfiniteProducts: (...args: unknown[]) => testCtx.infiniteProductsMock(...args),
}));

vi.mock("@/entities/user", () => ({
    selectUserCurrency: (state: StateSchema) => state.user?.currency,
}));

vi.mock("@/shared/lib/state", () => ({
    useAppSelector: (selector: (state: StateSchema) => unknown) =>
        selector(testCtx.state as StateSchema),
}));

describe("useCatalog", () => {
    const expectedActiveFilters = {
        brands: ["Apple"],
        countries: [],
        minPrice: undefined,
        maxPrice: undefined,
        inStock: true,
        sortBy: "price",
        sortOrder: "asc",
    };

    beforeEach(() => {
        vi.clearAllMocks();
        testCtx.state = {
            user: {currency: "USD"},
            productFilters: {
                filters: {
                    brands: ["Apple"],
                    countries: [],
                    priceRange: {},
                    inStock: true,
                    sortBy: "price",
                    sortOrder: "asc",
                },
                isOpen: false,
            },
        } as unknown as StateSchema;
        testCtx.fetchNextPageMock = vi.fn().mockResolvedValue(undefined);
        testCtx.refetchMock = vi.fn();
        testCtx.resolvedCategoryIdMock.mockReturnValue({
            data: {resolvedCategoryId: "cat-1"},
            status: {isLoading: false, error: null},
        });
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
        const {result} = renderHook(() => useCatalog());

        expect(testCtx.resolvedCategoryIdMock).toHaveBeenCalledWith({
            categoryId: undefined,
            slug: "phones",
            locale: "en",
        });
        expect(testCtx.infiniteProductsMock).toHaveBeenCalledWith(
            {
                categoryId: "cat-1",
                locale: "en",
                currency: "USD",
                ...expectedActiveFilters,
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

        const {result} = renderHook(() => useCatalog());

        act(() => {
            result.current.actions.loadMore({rowsCount: 20, stopIndex: 19});
        });

        expect(testCtx.fetchNextPageMock).not.toHaveBeenCalled();
    });

    test("uses provided category context and skips slug category lookup", () => {
        renderHook(() => useCatalog({categoryId: "cat-1"}));

        expect(testCtx.resolvedCategoryIdMock).toHaveBeenCalledWith({
            categoryId: "cat-1",
            slug: "phones",
            locale: "en",
        });
        expect(testCtx.infiniteProductsMock).toHaveBeenCalledWith(
            {
                categoryId: "cat-1",
                locale: "en",
                currency: "USD",
                ...expectedActiveFilters,
            },
            {skip: false},
        );
    });

    test("keeps loading while category id is being resolved", () => {
        testCtx.resolvedCategoryIdMock.mockReturnValue({
            data: {resolvedCategoryId: undefined},
            status: {isLoading: true, error: null},
        });

        testCtx.infiniteProductsMock.mockReturnValue({
            data: undefined,
            isLoading: false,
            isFetching: false,
            error: null,
            isFetchingNextPage: false,
            hasNextPage: false,
            fetchNextPage: testCtx.fetchNextPageMock,
            refetch: testCtx.refetchMock,
        });

        const {result} = renderHook(() => useCatalog());

        expect(testCtx.infiniteProductsMock).toHaveBeenCalledWith(
            {
                categoryId: undefined,
                locale: "en",
                currency: "USD",
                ...expectedActiveFilters,
            },
            {skip: true},
        );
        expect(result.current.status.isLoading).toBe(true);
    });
});
