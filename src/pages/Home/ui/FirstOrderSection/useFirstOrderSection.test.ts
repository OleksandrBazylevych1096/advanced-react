import {act, renderHook} from "@testing-library/react";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {useFirstOrderSection} from "./useFirstOrderSection";

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
    useAppSelector: (selector: () => unknown) => selector(),
}));

vi.mock("../../api/homePageApi", () => ({
    useGetFirstOrderProductsQuery: (...args: unknown[]) => testCtx.apiMock(...args),
}));

describe("useFirstOrderSection", () => {
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
        const {result} = renderHook(() => useFirstOrderSection());

        expect(testCtx.apiMock).toHaveBeenCalledWith({locale: "en", currency: "USD"});
        expect(result.current.data.products).toEqual([{id: "p1"}]);
        expect(result.current.data.currency).toBe("USD");

        act(() => {
            result.current.actions.retry();
        });

        expect(testCtx.refetchMock).toHaveBeenCalled();
    });
});
