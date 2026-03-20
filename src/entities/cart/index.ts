import {clearCartState} from "@/entities/cart/lib/clearCartState/clearCartState.ts";

import {
    cartApi,
    useGetCartCountQuery,
    useGetCartQuery,
    useSyncCartMutation,
    useValidateCartQuery,
} from "./api/cartApi";
import {
    applyCartItemQuantityChange,
    applyCartOptimisticUpdate,
    findCartItemIndexByProductId,
} from "./lib/cartOptimisticUpdate";
import {clearGuestCart, getGuestCart, setGuestCart} from "./lib/cartStorage";
import {broadcastCartClear, broadcastCartUpdate, onCartSync} from "./lib/cartSync";
import {recalculateCartTotals} from "./lib/recalculateCartTotals/recalculateCartTotals";
import {useCartController} from "./model/controllers/useCartController/useCartController";
import {useCartValidationController} from "./model/controllers/useCartValidationController/useCartValidationController";
import {
    selectGuestCartItemByProductId,
    selectGuestCartItemCount,
    selectGuestCartItems,
    selectGuestCartSubtotal,
    selectIsCartInitialized,
} from "./model/selectors/cartSelectors";
import {cartActions, cartReducer} from "./model/slice/cartSlice";
import type {
    Cart,
    CartItem,
    CartSchema,
    CartTotals,
    CartValidationItem,
    GuestCartItem,
} from "./model/types/CartSchema";
import {CartItemRow} from "./ui/CartItemRow/CartItemRow";

export {
    cartActions,
    cartReducer,
    cartApi,
    useGetCartQuery,
    useGetCartCountQuery,
    useValidateCartQuery,
    useSyncCartMutation,
    selectGuestCartItems,
    selectGuestCartItemCount,
    selectGuestCartSubtotal,
    selectIsCartInitialized,
    selectGuestCartItemByProductId,
    useCartController,
    useCartValidationController,
    clearGuestCart,
    getGuestCart,
    setGuestCart,
    broadcastCartClear,
    broadcastCartUpdate,
    onCartSync,
    applyCartOptimisticUpdate,
    applyCartItemQuantityChange,
    findCartItemIndexByProductId,
    clearCartState,
    recalculateCartTotals,
    CartItemRow,
};

export type {Cart, CartItem, CartSchema, CartTotals, CartValidationItem, GuestCartItem};
