import {useEffect} from "react";

import {cartActions, getGuestCart, onCartSync} from "@/entities/cart";

import {useAppDispatch} from "@/shared/lib/state";

export const useInitializeCart = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        return onCartSync((items) => {
            dispatch(cartActions.setGuestItems(items));
        });
    }, [dispatch]);

    useEffect(() => {
        const guestItems = getGuestCart();
        dispatch(cartActions.initGuestCart(guestItems));
    }, [dispatch]);
};
