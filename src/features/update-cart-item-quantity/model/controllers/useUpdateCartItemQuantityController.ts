import {useCallback, useEffect} from "react";

import {broadcastCartUpdate, cartApi, cartActions, setGuestCart} from "@/entities/cart";
import {selectAccessToken, selectUserData} from "@/entities/user";

import {createControllerResult, useAppDispatch, useAppSelector, useAppStore} from "@/shared/lib";

import {useUpdateCartItemMutation} from "../../api/updateCartItemApi";

interface UseUpdateCartItemQuantityControllerOptions {
    onError?: (error: unknown) => void;
}

export const useUpdateCartItemQuantityController = (
    options: UseUpdateCartItemQuantityControllerOptions = {},
) => {
    const {onError} = options;
    const dispatch = useAppDispatch();
    const store = useAppStore();
    const coordinator = store.services.cartQuantityCoordinator;

    const user = useAppSelector(selectUserData);
    const accessToken = useAppSelector(selectAccessToken);
    const isAuthenticated = Boolean(user && accessToken);

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
                dispatch,
                send: (args) => updateItem(args),
                onError,
                getConfirmedQuantity: (targetProductId: string) => {
                    const cartQueryState = cartApi.endpoints.getCart.select()(store.getState());
                    const item = cartQueryState.data?.items.find(
                        (cartItem) =>
                            cartItem.productId === targetProductId ||
                            cartItem.product.id === targetProductId,
                    );

                    return item?.quantity ?? 0;
                },
            });
        },
        [coordinator, dispatch, isAuthenticated, store, syncGuestStorage, updateItem, onError],
    );

    return createControllerResult({
        actions: {updateQuantity},
    });
};
