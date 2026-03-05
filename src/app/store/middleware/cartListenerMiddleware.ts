import {createListenerMiddleware} from "@reduxjs/toolkit";

import {
    broadcastCartClear,
    cartActions,
    cartApi,
    clearGuestCart,
    getGuestCart,
} from "@/entities/cart";
import {userActions} from "@/entities/user";

export const cartListenerMiddleware = createListenerMiddleware();

const startAppListening = cartListenerMiddleware.startListening.withTypes<
    StateSchema,
    AppDispatch
>();

startAppListening({
    actionCreator: userActions.setAccessToken,
    effect: async (_action, listenerApi) => {
        const guestItems = getGuestCart();

        if (guestItems.length === 0) {
            listenerApi.dispatch(
                cartApi.endpoints.getCart.initiate(undefined, {forceRefetch: true}),
            );
            return;
        }

        try {
            await listenerApi
                .dispatch(
                    cartApi.endpoints.syncCart.initiate({
                        guestCartItems: guestItems.map((item) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                        })),
                    }),
                )
                .unwrap();

            listenerApi.dispatch(cartActions.clearCart());
            clearGuestCart();
            broadcastCartClear();
        } catch (error) {
            console.error("[Cart] Failed to sync guest cart on login:", error);
        }
    },
});
