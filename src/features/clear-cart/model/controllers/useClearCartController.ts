import {useCallback} from "react";

import {broadcastCartClear, cartActions, clearGuestCart} from "@/entities/cart";

import {useClearCartMutation} from "../../api/clearCartApi";
import {selectIsAuthenticated} from "@/entities/user";

import {createControllerResult, useAppDispatch, useAppSelector, useToast} from "@/shared/lib";

export const useClearCartController = () => {
    const dispatch = useAppDispatch();
    const toast = useToast();

    const isAuthenticated = useAppSelector(selectIsAuthenticated);

    const [clearCartMutation, {isLoading: isClearing}] = useClearCartMutation();

    const clearCart = useCallback(async () => {
        if (!isAuthenticated) {
            dispatch(cartActions.clearCart());
            clearGuestCart();
            broadcastCartClear();
            return;
        }

        try {
            await clearCartMutation().unwrap();
        } catch {
            toast.error("Failed to clear cart");
        }
    }, [clearCartMutation, dispatch, isAuthenticated, toast]);

    return createControllerResult({
        status: {isClearing},
        actions: {clearCart},
    });
};
