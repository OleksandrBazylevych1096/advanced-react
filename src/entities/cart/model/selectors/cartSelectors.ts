import type {CartSchema, GuestCartItem} from "../types/CartSchema";

const selectCartState = (state: StateSchema): CartSchema => state.cart;

export const selectGuestCartItems = (state: StateSchema): GuestCartItem[] =>
    selectCartState(state).guestItems;

export const selectGuestCartItemCount = (state: StateSchema): number =>
    selectCartState(state).guestItems.reduce((sum, item) => sum + item.quantity, 0);

export const selectGuestCartSubtotal = (state: StateSchema): number =>
    selectCartState(state).guestItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0,
    );

export const selectIsCartInitialized = (state: StateSchema): boolean =>
    selectCartState(state).isInitialized;

export const selectGuestCartItemByProductId = (
    state: StateSchema,
    productId: string,
): GuestCartItem | undefined =>
    selectCartState(state).guestItems.find((item) => item.productId === productId);
