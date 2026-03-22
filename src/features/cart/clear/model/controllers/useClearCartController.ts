import {useCallback} from "react";

import {clearCartState} from "@/entities/cart";
import {selectIsAuthenticated} from "@/entities/user";

import {useToast} from "@/shared/lib/notifications";
import {createControllerResult, useAppDispatch, useAppSelector} from "@/shared/lib/state";

import {useClearCartMutation} from "../../api/clearCartApi";

export const useClearCartController = () => {
    const dispatch = useAppDispatch();
    const toast = useToast();

    const isAuthenticated = useAppSelector(selectIsAuthenticated);

    const [clearCartMutation, {isLoading: isClearing}] = useClearCartMutation();

    const clearCart = useCallback(async () => {
        if (!isAuthenticated) {
            clearCartState(dispatch);
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
