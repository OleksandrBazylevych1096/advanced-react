import {act, renderHook} from "@testing-library/react";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {useManageShippingAddressController} from "./useManageShippingAddressController";

const testCtx = vi.hoisted(() => ({
    dispatchMock: vi.fn(),
    navigateMock: vi.fn(),
    state: undefined as StateSchema | undefined,
    defaultAddressQueryMock: vi.fn(),
}));

vi.mock("react-i18next", () => ({
    useTranslation: () => ({t: (key: string) => `t:${key}`}),
    initReactI18next: {type: "3rdParty", init: vi.fn()},
}));

vi.mock("react-router", () => ({
    useNavigate: () => testCtx.navigateMock,
    useParams: () => ({lng: "en"}),
}));

vi.mock("@/features/shipping-address/save", () => ({
    ADDRESS_MODE_TITLES: {
        choose: "shipping.choose",
        add: "shipping.add",
        edit: "shipping.edit",
    },
    saveShippingAddressActions: {
        returnToChoose: () => ({type: "shipping/returnToChoose"}),
        openManageShippingAddressModal: () => ({type: "shipping/openManageShippingAddressModal"}),
        closeManageShippingAddressModal: () => ({type: "shipping/closeManageShippingAddressModal"}),
    },
    selectSaveShippingAddressMode: (state: StateSchema) => state.saveShippingAddress?.mode,
    selectIsManageShippingAddressModalOpen: (state: StateSchema) =>
        Boolean(state.saveShippingAddress?.isManageShippingAddressModalOpen),
}));

vi.mock("@/entities/shipping-address", () => ({
    useGetDefaultShippingAddressQuery: (...args: unknown[]) =>
        testCtx.defaultAddressQueryMock(...args),
}));

vi.mock("@/entities/user", () => ({
    selectUserData: (state: StateSchema) => state.user?.userData,
    selectIsAuthenticated: (state: StateSchema) =>
        Boolean(state.user?.userData && state.user?.accessToken),
}));

vi.mock("@/shared/lib/state", () => ({
    createControllerResult: <T>(value: T) => value,
    useAppDispatch: () => testCtx.dispatchMock,
    useAppSelector: (selector: (state: StateSchema) => unknown) =>
        selector(testCtx.state as StateSchema),
}));

vi.mock("@/shared/lib/routing", () => ({
    useLocalizedRoutePath: () => (path: string) => path.replace(":lng", "en"),
}));

describe("useManageShippingAddressController", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        testCtx.state = {
            user: {userData: {id: "u1"}, accessToken: "token-1"},
            saveShippingAddress: {mode: "edit", isManageShippingAddressModalOpen: false},
        } as StateSchema;
        testCtx.defaultAddressQueryMock.mockReturnValue({
            isLoading: false,
            currentData: {id: "addr1"},
            isError: false,
        });
    });

    test("exposes modal data and actions", () => {
        const {result} = renderHook(() => useManageShippingAddressController());

        expect(testCtx.defaultAddressQueryMock).toHaveBeenCalledWith(undefined, {
            skip: false,
        });
        expect(result.current.data).toMatchObject({
            defaultAddress: {id: "addr1"},
            modalTitle: "t:shipping.edit",
            shouldShowEditForm: true,
            mode: "edit",
            isAuthenticated: true,
            isModalOpen: false,
        });

        act(() => {
            result.current.actions.openSignIn();
            result.current.actions.openModal();
            result.current.actions.closeModal();
            result.current.actions.goBack();
        });

        expect(testCtx.navigateMock).toHaveBeenCalledWith("/en/login");
        expect(testCtx.dispatchMock).toHaveBeenCalledWith({
            type: "shipping/returnToChoose",
        });
        expect(testCtx.dispatchMock).toHaveBeenCalledWith({
            type: "shipping/openManageShippingAddressModal",
        });
        expect(testCtx.dispatchMock).toHaveBeenCalledWith({
            type: "shipping/closeManageShippingAddressModal",
        });
        expect(testCtx.dispatchMock).toHaveBeenCalledTimes(4);
    });
});
