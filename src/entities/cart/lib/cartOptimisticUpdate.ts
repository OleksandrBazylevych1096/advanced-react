import {cartApi} from "../api/cartApi";
import type {Cart} from "../model/types/CartSchema";

import {recalculateCartTotals} from "./recalculateCartTotals";

export const findCartItemIndexByProductId = (cart: Cart, productId: string): number =>
    cart.items.findIndex((item) => item.productId === productId || item.product.id === productId);

export const applyCartItemQuantityChange = (
    cart: Cart,
    productId: string,
    quantity: number,
): void => {
    const itemIndex = findCartItemIndexByProductId(cart, productId);
    if (itemIndex === -1) return;

    if (quantity <= 0) {
        cart.items.splice(itemIndex, 1);
    } else {
        cart.items[itemIndex].quantity = quantity;
    }

    recalculateCartTotals(cart);
};

export const applyCartOptimisticUpdate = (dispatch: AppDispatch, updater: (draft: Cart) => void) =>
    dispatch(cartApi.util.updateQueryData("getCart", undefined, updater));
