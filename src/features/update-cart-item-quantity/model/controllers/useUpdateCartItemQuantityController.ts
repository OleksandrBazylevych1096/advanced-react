import {useCallback, useEffect, useMemo} from "react";
import {useTranslation} from "react-i18next";

import {broadcastCartUpdate, cartApi, cartActions, setGuestCart} from "@/entities/cart";
import {selectIsAuthenticated, selectUserCurrency} from "@/entities/user";

import {createControllerResult, useAppDispatch, useAppSelector, useAppStore} from "@/shared/lib";

import {useUpdateCartItemMutation} from "../../api/updateCartItemApi";

interface UseUpdateCartItemQuantityControllerOptions {
    onError?: (error: unknown) => void;
}

export const useUpdateCartItemQuantityController = (
    options: UseUpdateCartItemQuantityControllerOptions = {},
) => {
    const {i18n} = useTranslation();
    const {onError} = options;
    const dispatch = useAppDispatch();
    const store = useAppStore();
    const coordinator = store.services.cartQuantityCoordinator;

    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const currency = useAppSelector(selectUserCurrency);
    const cartQueryArgs = useMemo(
        () => ({
            locale: i18n.language,
            currency,
        }),
        [currency, i18n.language],
    );

    const [updateItem] = useUpdateCartItemMutation();

    const syncGuestStorage = useCallback(() => {
        const nextGuestItems = store.getState().cart.guestItems;
        setGuestCart(nextGuestItems);
        broadcastCartUpdate(nextGuestItems);
    }, [store]);

    useEffect(() => {
        const unsubscribe = coordinator.subscribe();
        return unsubscribe;
    }, [coordinator]);

    useEffect(() => {
        const flushPendingUpdates = () => {
            coordinator.flushAllNow();
        };

        const flushOnVisibilityChange = () => {
            if (document.visibilityState === "hidden") {
                flushPendingUpdates();
            }
        };

        window.addEventListener("pagehide", flushPendingUpdates);
        window.addEventListener("beforeunload", flushPendingUpdates);
        document.addEventListener("visibilitychange", flushOnVisibilityChange);

        return () => {
            window.removeEventListener("pagehide", flushPendingUpdates);
            window.removeEventListener("beforeunload", flushPendingUpdates);
            document.removeEventListener("visibilitychange", flushOnVisibilityChange);
        };
    }, [coordinator]);

    const updateQuantity = useCallback(
        (productId: string, quantity: number) => {
            if (!isAuthenticated) {
                dispatch(cartActions.updateQuantity({productId, quantity}));
                syncGuestStorage();
                return;
            }

            coordinator.enqueue({
                productId,
                quantity,
                cartQueryArgs,
                dispatch,
                send: (args) => updateItem(args),
                onError,
                getConfirmedQuantity: (targetProductId: string) => {
                    const cartQueryState = cartApi.endpoints.getCart.select(cartQueryArgs)(
                        store.getState(),
                    );
                    const item = cartQueryState.data?.items.find(
                        (cartItem) =>
                            cartItem.productId === targetProductId ||
                            cartItem.product.id === targetProductId,
                    );

                    return item?.quantity ?? 0;
                },
            });
        },
        [
            cartQueryArgs,
            coordinator,
            dispatch,
            isAuthenticated,
            onError,
            store,
            syncGuestStorage,
            updateItem,
        ],
    );

    return createControllerResult({
        actions: {updateQuantity},
    });
};
