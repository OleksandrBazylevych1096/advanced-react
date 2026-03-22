import {act, renderHook} from "@testing-library/react";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {useBestSellingProductsController} from "./useBestSellingProductsController";

const testCtx = vi.hoisted(() => ({
    queryMock: vi.fn(),
    refetchMock: vi.fn(),
}));

vi.mock("react-i18next", () => ({
    useTranslation: () => ({i18n: {language: "en"}}),
}));

vi.mock("@/entities/user", () => ({
    selectUserCurrency: () => "USD",
}));

vi.mock("@/shared/lib/state", () => ({
    createControllerResult: <T>(value: T) => value,
    useAppSelector: (selector: () => unknown) => selector(),
}));

vi.mock("../../api/bestSellingProductsApi", () => ({
    useGetBestSellingProductsQuery: (...args: unknown[]) => testCtx.queryMock(...args),
}));

describe("useBestSellingProductsController", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        testCtx.refetchMock = vi.fn();
        testCtx.queryMock.mockReturnValue({
            data: {products: [{id: "p1"}], total: 1},
            isError: false,
            isFetching: false,
            isLoading: false,
            refetch: testCtx.refetchMock,
        });
    });

    test("returns products and stores embla api", () => {
        const {result} = renderHook(() => useBestSellingProductsController());

        expect(testCtx.queryMock).toHaveBeenCalledWith({locale: "en", currency: "USD"});
        expect(result.current.data.products).toEqual([{id: "p1"}]);
        expect(result.current.data.total).toBe(1);
        expect(result.current.data.emblaApi).toBeUndefined();

        const embla = {scrollNext: vi.fn()} as never;
        act(() => {
            result.current.actions.setCarouselApi(embla);
        });

        expect(result.current.data.emblaApi).toBe(embla);
        expect(result.current.actions.refetch).toBe(testCtx.refetchMock);
    });
});
