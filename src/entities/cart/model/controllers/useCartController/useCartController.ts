import {useMemo} from "react";

import {createControllerResult, useAppSelector} from "@/shared/lib";

import {useGetCartQuery} from "../../../api/cartApi";
import {
    selectGuestCartItemCount,
    selectGuestCartItems,
    selectGuestCartSubtotal,
} from "../../selectors/cartSelectors";
import type {Cart} from "../../types/CartSchema";

interface UseCartOptions {
    isAuthenticated: boolean;
}

export const useCartController = (options: UseCartOptions) => {
    const {isAuthenticated} = options;

    const guestItems = useAppSelector(selectGuestCartItems);
    const guestItemCount = useAppSelector(selectGuestCartItemCount);
    const guestSubtotal = useAppSelector(selectGuestCartSubtotal);

    const {
        data: serverCart,
        isLoading,
        isFetching,
        isError,
        refetch,
    } = useGetCartQuery(undefined, {skip: !isAuthenticated});

    const cart = useMemo(() => {
        if (isAuthenticated) return serverCart;

        return {
            items: guestItems.map((gi) => ({
                id: `guest-${gi.productId}`,
                productId: gi.productId,
                quantity: gi.quantity,
                product: gi.product,
            })),
            totals: {
                subtotal: guestSubtotal,
                totalItems: guestItemCount,
                estimatedShipping: 0,
                estimatedTax: 0,
                total: guestSubtotal,
            },
        } as Cart;
    }, [guestItemCount, guestItems, guestSubtotal, isAuthenticated, serverCart]);

    const itemCount = isAuthenticated ? (serverCart?.totals.totalItems ?? 0) : guestItemCount;

    return createControllerResult({
        data: {
            cart,
            isAuthenticated,
        },
        derived: {
            itemCount,
        },
        status: {
            isLoading: isAuthenticated ? isLoading : false,
            isFetching: isAuthenticated ? isFetching : false,
            isError: isAuthenticated ? isError : false,
        },
        actions: {
            refetch,
        },
    });
};
