import {renderHook} from "@testing-library/react";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {useCheckoutMainSectionController} from "./useCheckoutMainSectionController";

const testCtx = vi.hoisted(() => ({
    state: undefined as StateSchema | undefined,
    summaryQueryMock: vi.fn(),
    defaultAddressQueryMock: vi.fn(),
    dispatchMock: vi.fn(),
    navigateMock: vi.fn(),
}));

vi.mock("react-i18next", () => ({
    initReactI18next: {
        type: "3rdParty",
        init: () => undefined,
    },
    useTranslation: () => ({
        i18n: {language: "en"},
    }),
}));

vi.mock("react-router", () => ({
    useNavigate: () => testCtx.navigateMock,
}));

vi.mock("@/features/checkout/place-order", () => ({
    useGetCheckoutSummaryQuery: (...args: unknown[]) => testCtx.summaryQueryMock(...args),
}));

vi.mock("@/features/shipping-address/save", () => ({
    saveShippingAddressActions: {
        openManageShippingAddressModal: () => ({
            type: "shipping/openManageShippingAddressModal",
        }),
    },
}));

vi.mock("@/entities/shipping-address", () => ({
    useGetDefaultShippingAddressQuery: (...args: unknown[]) =>
        testCtx.defaultAddressQueryMock(...args),
}));

vi.mock("@/entities/user", () => ({
    selectIsAuthenticated: (state: StateSchema) => Boolean(state.user?.userData),
    selectUserCurrency: () => "USD",
}));

vi.mock("@/shared/lib", () => ({
    createControllerResult: <T>(value: T) => value,
    useAppDispatch: () => testCtx.dispatchMock,
    useAppSelector: (selector: (state: StateSchema) => unknown) =>
        selector(testCtx.state as StateSchema),
    useLocalizedRoutePath: () => (path: string) => path.replace(":lng", "en"),
}));

describe("useCheckoutMainSectionController", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        testCtx.state = {
            user: {userData: {id: "u-1"}},
        } as StateSchema;
        testCtx.summaryQueryMock.mockReturnValue({
            data: {
                items: [{id: "ci-1"}],
                totals: {
                    subtotal: 10,
                    freeShippingTarget: 50,
                    totalItems: 1,
                    estimatedShipping: 1,
                    estimatedTax: 1,
                    total: 12,
                },
                validation: [],
            },
            isLoading: false,
            isError: false,
        });
        testCtx.defaultAddressQueryMock.mockReturnValue({
            data: {
                streetAddress: "Main st",
                city: "Boston",
                zipCode: "02118",
            },
            isLoading: false,
        });
    });

    test("returns formatted address and summary data", () => {
        const {result} = renderHook(() => useCheckoutMainSectionController());

        expect(result.current.data.formattedAddress).toBe("Main st, Boston, 02118");
        expect(result.current.data.summary?.items).toHaveLength(1);
        expect(result.current.status.isLoading).toBe(false);

        result.current.actions.openManageShippingAddressModal();
        expect(testCtx.dispatchMock).toHaveBeenCalledWith({
            type: "shipping/openManageShippingAddressModal",
        });
    });
});
