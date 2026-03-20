import {useRemoveFromCartController} from "@/features/remove-from-cart";
import {useUpdateCartItemQuantityController} from "@/features/update-cart-item-quantity";

import {useCartController, useCartValidationController} from "@/entities/cart";
import {selectIsAuthenticated, selectUserCurrency} from "@/entities/user";

import {createControllerResult, useAppSelector, useToast} from "@/shared/lib";

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
