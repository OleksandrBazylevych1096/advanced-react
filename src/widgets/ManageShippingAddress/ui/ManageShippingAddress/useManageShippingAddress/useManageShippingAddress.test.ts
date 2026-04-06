import {act, renderHook} from "@testing-library/react";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {useManageShippingAddress} from "./useManageShippingAddress.ts";

const testCtx = vi.hoisted(() => ({
    dispatchMock: vi.fn(),
    navigateMock: vi.fn(),
    state: undefined as StateSchema | undefined,
}));

vi.mock("react-i18next", () => ({
    useTranslation: () => ({t: (key: string) => `t:${key}`}),
    initReactI18next: {type: "3rdParty", init: vi.fn()},
}));

vi.mock("react-router", () => ({
    useNavigate: () => testCtx.navigateMock,
    useParams: () => ({lng: "en"}),
}));

vi.mock("@/features/save-shipping-address", () => ({
    ADDRESS_MODE_TITLES: {
        choose: "shipping.choose",
        add: "shipping.add",
        edit: "shipping.edit",
    },
    saveShippingAddressActions: {
        returnToChoose: () => ({type: "shipping/returnToChoose"}),
    },
    selectSaveShippingAddressMode: (state: StateSchema) => state.saveShippingAddress?.mode,
}));

vi.mock("@/entities/user", () => ({
    selectIsAuthenticated: (state: StateSchema) =>
        Boolean(state.user?.userData && state.user?.accessToken),
}));

vi.mock("@/shared/lib/state", () => ({
    useAppDispatch: () => testCtx.dispatchMock,
    useAppSelector: (selector: (state: StateSchema) => unknown) =>
        selector(testCtx.state as StateSchema),
}));

vi.mock("@/shared/lib/routing", () => ({
    useLocalizedRoutePath: () => (path: string) => path.replace(":lng", "en"),
}));

describe("useManageShippingAddress", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        testCtx.state = {
            user: {userData: {id: "u1"}, accessToken: "token-1"},
            saveShippingAddress: {mode: "edit"},
        } as StateSchema;
    });

    test("exposes inline data and actions", () => {
        const {result} = renderHook(() => useManageShippingAddress());

        expect(result.current.data).toMatchObject({
            modalTitle: "t:shipping.edit",
            shouldShowEditForm: true,
            mode: "edit",
            isAuthenticated: true,
        });

        act(() => {
            result.current.actions.openSignIn();
            result.current.actions.goBack();
        });

        expect(testCtx.navigateMock).toHaveBeenCalledWith("/en/login");
        expect(testCtx.dispatchMock).toHaveBeenCalledWith({
            type: "shipping/returnToChoose",
        });
        expect(testCtx.dispatchMock).toHaveBeenCalledTimes(1);
    });
});
