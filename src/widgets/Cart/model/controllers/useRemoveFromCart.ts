import {useCallback} from "react";

import {broadcastCartUpdate, cartActions, setGuestCart} from "@/entities/cart";
import {selectIsAuthenticated} from "@/entities/user";

import {isAbortError} from "@/shared/lib/errors";
import {useToast} from "@/shared/lib/notifications";
import {useAppDispatch, useAppSelector, useAppStore} from "@/shared/lib/state";

import {useRemoveFromCartMutation} from "../../api/removeFromCartApi";

export const useRemoveFromCart = () => {
    const dispatch = useAppDispatch();
    const store = useAppStore();
    const toast = useToast();

    const isAuthenticated = useAppSelector(selectIsAuthenticated);

    const [removeItemMutation] = useRemoveFromCartMutation();

    const syncGuestStorage = useCallback(() => {
        const nextGuestItems = store.getState().cart.guestItems;
        setGuestCart(nextGuestItems);
        broadcastCartUpdate(nextGuestItems);
    }, [store]);

    const removeItem = useCallback(
        async (productId: string) => {
            if (!isAuthenticated) {
                dispatch(cartActions.removeItem(productId));
                syncGuestStorage();
                return;
            }

            try {
                await removeItemMutation(productId).unwrap();
            } catch (error) {
                if (isAbortError(error)) return;
                toast.error("Failed to remove item");
            }
        },
        [dispatch, isAuthenticated, removeItemMutation, syncGuestStorage, toast],
    );

    return {
        actions: {removeItem},
    };
};
