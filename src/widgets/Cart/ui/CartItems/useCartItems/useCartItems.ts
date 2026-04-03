import {useUpdateCartItemQuantity} from "@/features/update-cart-item-quantity";

import {useCart, useCartValidation} from "@/entities/cart";
import {selectIsAuthenticated, selectUserCurrency} from "@/entities/user";

import {useToast} from "@/shared/lib/notifications";
import {useAppSelector} from "@/shared/lib/state";

import {useRemoveFromCart} from "../../../model/controllers/useRemoveFromCart";

export const useCartItems = () => {
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const currency = useAppSelector(selectUserCurrency);
    const toast = useToast();

    const {
        data: {cart},
        status: {isLoading, isError},
        actions: {refetch},
    } = useCart({isAuthenticated});

    const {
        actions: {getItemValidation},
    } = useCartValidation(cart?.items ?? [], {isAuthenticated});

    const {
        actions: {removeItem},
    } = useRemoveFromCart();

    const {
        actions: {updateQuantity},
    } = useUpdateCartItemQuantity({
        onError: () => toast.error("Failed to update cart"),
    });

    return {
        data: {
            items: cart?.items ?? [],
            currency,
        },
        status: {
            isLoading,
            isError,
        },
        derived: {
            itemsCount: cart?.items.length ?? 0,
        },
        actions: {
            refetch,
            removeItem,
            updateQuantity,
            getItemValidation,
        },
    };
};
