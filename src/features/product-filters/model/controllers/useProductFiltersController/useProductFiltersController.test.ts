import {act, renderHook} from "@testing-library/react";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {useProductFiltersController} from "./useProductFiltersController";

const testCtx = vi.hoisted(() => ({
    state: undefined as StateSchema | undefined,
    dispatchMock: vi.fn(),
    setSearchParamsMock: vi.fn(),
    resolveCategoryIdMock: vi.fn(),
    infiniteProductsMock: vi.fn(),
    refetchMock: vi.fn(),
}));

vi.mock("react-i18next", () => ({
    useTranslation: () => ({i18n: {language: "en"}}),
}));

vi.mock("react-router", () => ({
    useParams: () => ({slug: "phones"}),
    useSearchParams: () => [new URLSearchParams(), testCtx.setSearchParamsMock],
}));

vi.mock("@/entities/category", () => ({
    useResolvedCategoryIdController: (...args: unknown[]) => testCtx.resolveCategoryIdMock(...args),
}));

vi.mock("@/entities/product", () => ({
    useGetInfiniteProducts: (...args: unknown[]) => testCtx.infiniteProductsMock(...args),
}));

vi.mock("@/entities/user", () => ({
    selectUserCurrency: (state: StateSchema) => state.user?.currency,
}));

vi.mock("@/features/product-filters/config/defaults.ts", () => ({
    DEBOUNCE_DELAY: 300,
    DEFAULT_SORT_BY: "createdAt",
    DEFAULT_SORT_ORDER: "desc",
    URL_PARAMS: {
        COUNTRIES: "countries",
        BRANDS: "brands",
        MIN_PRICE: "minPrice",
        MAX_PRICE: "maxPrice",
        SORT_BY: "sortBy",
        SORT_ORDER: "sortOrder",
    },
}));

vi.mock("@/features/product-filters/lib/parsePriceRange/parsePriceRange.ts", () => ({
    parsePriceRange: vi.fn(),
}));

vi.mock("@/features/product-filters/lib/sortOptionsHelpers/sortOptionsHelpers.ts", () => ({
    isValidSortBy: vi.fn(() => false),
    isValidSortOrder: vi.fn(() => false),
}));

vi.mock("@/features/product-filters/lib/validateFiltersFromURL.ts", () => ({
    validateFiltersFromURL: vi.fn(() => ({validCountries: [], validBrands: []})),
}));

vi.mock("@/features/product-filters/model/selectors/productFiltersSelectors.ts", () => ({
    selectActiveFilters: (state: StateSchema) => ({
        brands: state.productFilters?.filters.brands ?? [],
        countries: state.productFilters?.filters.countries ?? [],
        minPrice: state.productFilters?.filters.priceRange.min,
        maxPrice: state.productFilters?.filters.priceRange.max,
        inStock: state.productFilters?.filters.inStock ?? true,
        sortBy: state.productFilters?.filters.sortBy ?? "createdAt",
        sortOrder: state.productFilters?.filters.sortOrder ?? "desc",
    }),
    selectHasActiveFilters: (state: StateSchema) =>
        Boolean(
            (state.productFilters?.filters.brands.length ?? 0) > 0 ||
            (state.productFilters?.filters.countries.length ?? 0) > 0 ||
            state.productFilters?.filters.priceRange.min !== undefined ||
            state.productFilters?.filters.priceRange.max !== undefined,
        ),
    selectProductFilters: (state: StateSchema) => state.productFilters,
    selectProductFiltersIsOpen: (state: StateSchema) => state.productFilters?.isOpen,
    selectSelectedBrands: (state: StateSchema) => state.productFilters?.filters.brands,
    selectSelectedCountries: (state: StateSchema) => state.productFilters?.filters.countries,
    selectSelectedPriceRange: (state: StateSchema) => state.productFilters?.filters.priceRange,
    selectSortSettings: (state: StateSchema) => ({
        sortBy: state.productFilters?.filters.sortBy ?? "createdAt",
        sortOrder: state.productFilters?.filters.sortOrder ?? "desc",
    }),
}));

vi.mock("@/features/product-filters/model/slice/productFiltersSlice.ts", () => ({
    productFiltersActions: {
        toggleCountry: (value: string) => ({type: "filters/toggleCountry", payload: value}),
        toggleBrand: (value: string) => ({type: "filters/toggleBrand", payload: value}),
        setSortBy: (value: string) => ({type: "filters/setSortBy", payload: value}),
        setSortOrder: (value: string) => ({type: "filters/setSortOrder", payload: value}),
        resetFilters: () => ({type: "filters/reset"}),
        setIsOpen: (value: boolean) => ({type: "filters/setIsOpen", payload: value}),
        setSelectedPriceRange: (payload: unknown) => ({
            type: "filters/setSelectedPriceRange",
            payload,
        }),
        setSelectedCountries: (payload: unknown) => ({
            type: "filters/setSelectedCountries",
            payload,
        }),
        setSelectedBrands: (payload: unknown) => ({type: "filters/setSelectedBrands", payload}),
        resetPriceRange: () => ({type: "filters/resetPriceRange"}),
    },
}));

vi.mock("@/shared/lib", () => ({
    useDebounce: <T>(value: T) => value,
}));

vi.mock("@/shared/lib", () => ({
    clampOptionalRange: vi.fn((range: unknown) => range),
    createControllerResult: <T>(value: T) => value,
    useAppDispatch: () => testCtx.dispatchMock,
    useAppSelector: (selector: (state: StateSchema) => unknown) =>
        selector(testCtx.state as StateSchema),
}));

describe("useProductFiltersController", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        testCtx.refetchMock = vi.fn();
        testCtx.state = {
            user: {currency: "USD"},
            toast: {toasts: []},
            cart: {guestItems: [], isInitialized: true},
            baseAPI: {},
            productFilters: {
                filters: {
                    priceRange: {min: undefined, max: undefined},
                    countries: [],
                    brands: [],
                    inStock: true,
                    sortBy: "price",
                    sortOrder: "asc",
                },
                isOpen: true,
            },
        } as unknown as StateSchema;
        testCtx.resolveCategoryIdMock.mockReturnValue({
            data: {resolvedCategoryId: "cat-1"},
            status: {isLoading: false, error: null},
        });
        testCtx.infiniteProductsMock.mockReturnValue({
            facets: undefined,
            isLoading: false,
            error: null,
            refetch: testCtx.refetchMock,
        });
    });

    test("returns filters state and dispatches filter actions", () => {
        const {result} = renderHook(() => useProductFiltersController());

        expect(result.current.data.currency).toBe("USD");
        expect(result.current.data.isSidebarOpen).toBe(true);
        expect(result.current.status).toEqual({isLoading: false, hasError: false});
        expect(result.current.actions.refetch).toBe(testCtx.refetchMock);

        act(() => {
            result.current.actions.toggleCountry("UA");
            result.current.actions.toggleBrand("Apple");
            result.current.actions.changeSort("price" as never, "asc" as never);
            result.current.actions.resetFilters();
            result.current.actions.closeSidebar();
        });

        expect(testCtx.dispatchMock).toHaveBeenCalledWith({
            type: "filters/toggleCountry",
            payload: "UA",
        });
        expect(testCtx.dispatchMock).toHaveBeenCalledWith({
            type: "filters/toggleBrand",
            payload: "Apple",
        });
        expect(testCtx.dispatchMock).toHaveBeenCalledWith({
            type: "filters/setSortBy",
            payload: "price",
        });
        expect(testCtx.dispatchMock).toHaveBeenCalledWith({
            type: "filters/setSortOrder",
            payload: "asc",
        });
        expect(testCtx.dispatchMock).toHaveBeenCalledWith({type: "filters/reset"});
        expect(testCtx.dispatchMock).toHaveBeenCalledWith({
            type: "filters/setIsOpen",
            payload: false,
        });
    });

    test("updates local price range via action", () => {
        const {result} = renderHook(() => useProductFiltersController());

        act(() => {
            result.current.actions.changePriceRange({min: 10, max: 20});
        });

        expect(result.current.data.localPriceRange).toEqual({min: 10, max: 20});
    });

    test("uses provided category context and skips slug category lookup", () => {
        renderHook(() => useProductFiltersController({categoryId: "cat-1"}));

        expect(testCtx.resolveCategoryIdMock).toHaveBeenCalledWith({
            categoryId: "cat-1",
            slug: "phones",
            locale: "en",
        });
        expect(testCtx.infiniteProductsMock).toHaveBeenCalledWith(
            {
                categoryId: "cat-1",
                locale: "en",
                currency: "USD",
                brands: [],
                countries: [],
                minPrice: undefined,
                maxPrice: undefined,
                inStock: true,
                sortBy: "price",
                sortOrder: "asc",
            },
            {
                skip: false,
                selectFromResult: expect.any(Function),
            },
        );
    });
});


