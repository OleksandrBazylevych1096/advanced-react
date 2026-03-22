import {useRemoveFromCartController} from "@/features/cart/remove";
import {useUpdateCartItemQuantityController} from "@/features/cart/update-item-quantity";

import {useCartController, useCartValidationController} from "@/entities/cart";
import {selectIsAuthenticated, selectUserCurrency} from "@/entities/user";

import {useToast} from "@/shared/lib/notifications";
import {createControllerResult, useAppSelector} from "@/shared/lib/state";

export const useCartItemsController = () => {
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const currency = useAppSelector(selectUserCurrency);
    const toast = useToast();

    const {
        data: {cart},
        status: {isLoading, isError},
        actions: {refetch},
    } = useCartController({isAuthenticated});

    const {
        actions: {getItemValidation},
    } = useCartValidationController(cart?.items ?? [], {isAuthenticated});

    const {
        actions: {removeItem},
    } = useRemoveFromCartController();

    const {
        actions: {updateQuantity},
    } = useUpdateCartItemQuantityController({
        onError: () => toast.error("Failed to update cart"),
    });

    return createControllerResult({
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
    });
};
