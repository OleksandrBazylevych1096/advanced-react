import {act, renderHook} from "@testing-library/react";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {useFirstOrderSectionController} from "./useFirstOrderSectionController";

const testCtx = vi.hoisted(() => ({
    refetchMock: vi.fn(),
    apiMock: vi.fn(),
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

vi.mock("../../api/homePageApi", () => ({
    useGetFirstOrderProductsQuery: (...args: unknown[]) => testCtx.apiMock(...args),
}));

describe("useFirstOrderSectionController", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        testCtx.refetchMock = vi.fn();
        testCtx.apiMock.mockReturnValue({
            data: [{id: "p1"}],
            isFetching: false,
            isError: false,
            refetch: testCtx.refetchMock,
        });
    });

    test("returns products and retries query", () => {
        const {result} = renderHook(() => useFirstOrderSectionController());

        expect(testCtx.apiMock).toHaveBeenCalledWith({locale: "en", currency: "USD"});
        expect(result.current.data.products).toEqual([{id: "p1"}]);
        expect(result.current.data.currency).toBe("USD");

        act(() => {
            result.current.actions.retry();
        });

        expect(testCtx.refetchMock).toHaveBeenCalled();
    });
});
