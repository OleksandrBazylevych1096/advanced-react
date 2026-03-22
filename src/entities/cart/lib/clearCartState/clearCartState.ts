import {cartApi} from "../../api/cartApi";
import {cartActions} from "../../model/slice/cartSlice";
import {clearGuestCart} from "../cartStorage";
import {broadcastCartClear} from "../cartSync";

type DispatchFn = (action: unknown) => unknown;

interface ClearCartStateOptions {
    clearReduxState?: boolean;
    clearGuestStorage?: boolean;
    broadcastClear?: boolean;
    invalidateCartTags?: boolean;
}

export const clearCartState = (
    dispatch: DispatchFn,
    options: ClearCartStateOptions = {
        clearReduxState: true,
        clearGuestStorage: true,
        broadcastClear: true,
    },
): void => {
    if (options.clearReduxState) {
        dispatch(cartActions.clearCart());
    }

    if (options.clearGuestStorage) {
        clearGuestCart();
    }

    if (options.broadcastClear) {
        broadcastCartClear();
    }

    if (options.invalidateCartTags) {
        dispatch(cartApi.util.invalidateTags(["Cart", "CartValidation"]));
    }
};
