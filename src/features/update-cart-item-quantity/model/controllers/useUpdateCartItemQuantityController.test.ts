import {act, renderHook} from "@testing-library/react";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {useUpdateCartItemQuantityController} from "./useUpdateCartItemQuantityController";

const testCtx = vi.hoisted(() => ({
    state: undefined as StateSchema | undefined,
    dispatchMock: vi.fn(),
    storeGetStateMock: vi.fn(),
    updateItemMutationMock: vi.fn(),
    enqueueMock: vi.fn(),
    flushAllNowMock: vi.fn(),
    subscribeMock: vi.fn(),
    unsubscribeMock: vi.fn(),
    cartQueryData: undefined as
        | {items: Array<{productId: string; quantity: number; product: {id: string}}>}
        | undefined,
}));

vi.mock("@/entities/user", () => ({
    selectIsAuthenticated: (state: StateSchema) => Boolean(state.user?.userData),
    selectUserCurrency: (state: StateSchema) => state.user?.currency,
}));

vi.mock("react-i18next", () => ({
    initReactI18next: {
        type: "3rdParty",
        init: () => undefined,
    },
    useTranslation: () => ({
        i18n: {
            language: "en",
        },
    }),
}));

vi.mock("@/entities/cart", () => ({
    cartActions: {
        updateQuantity: (payload: {productId: string; quantity: number}) => ({
            type: "cart/updateQuantity",
            payload,
        }),
    },
    setGuestCart: vi.fn(),
    broadcastCartUpdate: vi.fn(),
    cartApi: {
        endpoints: {
            getCart: {
                select: () => () => ({data: testCtx.cartQueryData}),
            },
        },
    },
}));

vi.mock("@/shared/lib", () => ({
    createControllerResult: <T>(value: T) => value,
    useAppDispatch: () => testCtx.dispatchMock,
    useAppStore: () => ({
        getState: testCtx.storeGetStateMock,
        services: {
            cartQuantityCoordinator: {
                enqueue: testCtx.enqueueMock,
                flushAllNow: testCtx.flushAllNowMock,
                subscribe: testCtx.subscribeMock,
            },
        },
    }),
    useAppSelector: (selector: (state: StateSchema) => unknown) =>
        selector(testCtx.state as StateSchema),
}));

vi.mock("../../api/updateCartItemApi", () => ({
    useUpdateCartItemMutation: () => [testCtx.updateItemMutationMock],
}));

describe("useUpdateCartItemQuantityController", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        testCtx.state = {
            user: {userData: undefined, currency: "USD"},
        } as StateSchema;

        testCtx.storeGetStateMock.mockReturnValue({
            cart: {
                guestItems: [{productId: "p1", quantity: 2}],
            },
        });

        testCtx.updateItemMutationMock.mockReturnValue({
            unwrap: vi.fn().mockResolvedValue(undefined),
        });

        testCtx.subscribeMock.mockReturnValue(testCtx.unsubscribeMock);
        testCtx.cartQueryData = {
            items: [
                {
                    productId: "p1",
                    quantity: 4,
                    product: {id: "p1"},
                },
            ],
        };
    });

    test("subscribes to coordinator and flushes on lifecycle events", () => {
        const originalVisibilityState = document.visibilityState;
        const visibilityDescriptor = Object.getOwnPropertyDescriptor(
            Document.prototype,
            "visibilityState",
        );

        const {unmount} = renderHook(() => useUpdateCartItemQuantityController());

        expect(testCtx.subscribeMock).toHaveBeenCalledTimes(1);

        window.dispatchEvent(new Event("pagehide"));
        expect(testCtx.flushAllNowMock).toHaveBeenCalledTimes(1);

        Object.defineProperty(document, "visibilityState", {
            configurable: true,
            value: "hidden",
        });
        document.dispatchEvent(new Event("visibilitychange"));
        expect(testCtx.flushAllNowMock).toHaveBeenCalledTimes(2);

        unmount();
        expect(testCtx.unsubscribeMock).toHaveBeenCalledTimes(1);

        if (visibilityDescriptor) {
            Object.defineProperty(Document.prototype, "visibilityState", visibilityDescriptor);
        } else {
            Object.defineProperty(document, "visibilityState", {
                configurable: true,
                value: originalVisibilityState,
            });
        }
    });

    test("updates guest cart locally and syncs storage", async () => {
        const cartModule = await import("@/entities/cart");
        const {result} = renderHook(() => useUpdateCartItemQuantityController());

        act(() => {
            result.current.actions.updateQuantity("p1", 3);
        });

        expect(testCtx.dispatchMock).toHaveBeenCalledWith({
            type: "cart/updateQuantity",
            payload: {productId: "p1", quantity: 3},
        });
        expect(testCtx.enqueueMock).not.toHaveBeenCalled();
        expect(cartModule.setGuestCart).toHaveBeenCalledWith([{productId: "p1", quantity: 2}]);
        expect(cartModule.broadcastCartUpdate).toHaveBeenCalledWith([
            {productId: "p1", quantity: 2},
        ]);
    });

    test("enqueues authenticated updates with coordinator contracts", () => {
        testCtx.state = {
            user: {userData: {id: "u1"}, currency: "USD"},
        } as StateSchema;

        const onError = vi.fn();
        const {result} = renderHook(() => useUpdateCartItemQuantityController({onError}));

        act(() => {
            result.current.actions.updateQuantity("p1", 7);
        });

        expect(testCtx.enqueueMock).toHaveBeenCalledTimes(1);
        const enqueueArgs = testCtx.enqueueMock.mock.calls[0][0] as {
            productId: string;
            quantity: number;
            dispatch: unknown;
            send: (args: {productId: string; quantity: number}) => unknown;
            onError?: (error: unknown) => void;
            getConfirmedQuantity: (productId: string) => number;
        };

        expect(enqueueArgs.productId).toBe("p1");
        expect(enqueueArgs.quantity).toBe(7);
        expect(enqueueArgs.dispatch).toBe(testCtx.dispatchMock);
        expect(enqueueArgs.onError).toBe(onError);
        expect(enqueueArgs.getConfirmedQuantity("p1")).toBe(4);

        enqueueArgs.send({productId: "p1", quantity: 7});
        expect(testCtx.updateItemMutationMock).toHaveBeenCalledWith({
            productId: "p1",
            quantity: 7,
        });
    });
});
