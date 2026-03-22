import {act, renderHook, waitFor} from "@testing-library/react";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {useTrendingProductsController} from "./useTrendingProductsController";

const testCtx = vi.hoisted(() => ({
    state: undefined as StateSchema | undefined,
    tagsQueryMock: vi.fn(),
    productsQueryMock: vi.fn(),
    refetchMock: vi.fn(),
}));

vi.mock("react-i18next", () => ({
    initReactI18next: {type: "3rdParty", init: () => {}},
    useTranslation: () => ({i18n: {language: "en"}}),
}));

vi.mock("@/features/cart/add", () => ({
    ProductCardWithAddToCart: "ProductCardWithAddToCartMock",
}));

vi.mock("@/entities/product/api/productApi/productApi.ts", () => ({
    useGetProducts: (...args: unknown[]) => testCtx.productsQueryMock(...args),
}));

vi.mock("@/entities/user", () => ({
    selectUserCurrency: (state: StateSchema) => state.user?.currency,
}));

vi.mock("@/shared/lib", () => ({
    createControllerResult: <T>(value: T) => value,
    useAppSelector: (selector: (state: StateSchema) => unknown) =>
        selector(testCtx.state as StateSchema),
}));

vi.mock("../../api/trendingProductsApi", () => ({
    useGetTrendingProductTagsQuery: (...args: unknown[]) => testCtx.tagsQueryMock(...args),
}));

describe("useTrendingProductsController", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        testCtx.state = {user: {currency: "USD"}} as StateSchema;
        testCtx.refetchMock = vi.fn();
        testCtx.tagsQueryMock.mockReturnValue({
            data: [{id: "tag-1", name: "Hot"}],
            isError: false,
            isFetching: false,
            isLoading: false,
        });
        testCtx.productsQueryMock.mockImplementation(({tagId}: {tagId: string}) => ({
            data: tagId ? {products: [{id: "p1"}], total: 1} : undefined,
            isError: false,
            isFetching: false,
            isLoading: false,
            refetch: testCtx.refetchMock,
        }));
    });

    test("initializes current tag from first fetched tag and loads products", async () => {
        const {result} = renderHook(() => useTrendingProductsController());

        expect(testCtx.tagsQueryMock).toHaveBeenCalledWith({locale: "en"});

        await waitFor(() => {
            expect(result.current.data.currentTagId).toBe("tag-1");
        });

        expect(result.current.data.products).toEqual([{id: "p1"}]);
        expect(result.current.data.total).toBe(1);
        expect(result.current.data.ProductCardWithAddToCart).toBe("ProductCardWithAddToCartMock");
    });

    test("changes tag and stores embla api", async () => {
        const {result} = renderHook(() => useTrendingProductsController());

        await waitFor(() => {
            expect(result.current.data.currentTagId).toBe("tag-1");
        });

        act(() => {
            result.current.actions.changeTag("tag-2");
        });

        expect(result.current.data.currentTagId).toBe("tag-2");

        const embla = {scrollTo: vi.fn()} as never;
        act(() => {
            result.current.actions.setCarouselApi(embla);
        });
        expect(result.current.data.emblaApi).toBe(embla);
        expect(result.current.actions.refetch).toBe(testCtx.refetchMock);
    });
});
