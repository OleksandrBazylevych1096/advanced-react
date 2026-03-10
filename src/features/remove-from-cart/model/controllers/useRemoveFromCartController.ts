import {useCallback} from "react";

import {broadcastCartUpdate, cartActions, setGuestCart} from "@/entities/cart";
import {selectIsAuthenticated} from "@/entities/user";

import {
    createControllerResult,
    isAbortError,
    useAppDispatch,
    useAppSelector,
    useAppStore,
    useToast,
} from "@/shared/lib";

import {useRemoveFromCartMutation} from "../../api/removeFromCartApi";

export const useRemoveFromCartController = () => {
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

    return createControllerResult({
        actions: {removeItem},
    });
};
