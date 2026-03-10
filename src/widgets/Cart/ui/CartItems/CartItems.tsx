import {RemoveFromCartButton} from "@/features/remove-from-cart";
import {CartQuantityStepper} from "@/features/update-cart-item-quantity";

import {CartItemRow} from "@/entities/cart";

import {cn} from "@/shared/lib";
import {EmptyState, ErrorState, Spinner, Stack} from "@/shared/ui";

import {useCartItemsController} from "../../model/controllers/useCartItemsController";

import styles from "./CartItems.module.scss";

interface CartItemsProps {
    compact?: boolean;
    className?: string;
}

export const CartItems = ({compact, className}: CartItemsProps) => {
    const {
        data: {items, currency},
        status: {isLoading, isError},
        actions: {refetch, removeItem, updateQuantity, getItemValidation},
    } = useCartItemsController();

    if (isLoading) {
        return (
            <Stack className={cn(styles.root, className)}>
                <Stack className={styles.stateContainer} align="center" justify="center">
                    <Spinner size="lg" />
                </Stack>
            </Stack>
        );
    }

    if (isError) {
        return (
            <Stack className={cn(styles.root, className)}>
                <Stack className={styles.stateContainer} align="center" justify="center">
                    <ErrorState message="Failed to load cart" onRetry={refetch} />
                </Stack>
            </Stack>
        );
    }

    if (!items.length) {
        return (
            <Stack className={cn(styles.root, className)}>
                <Stack className={styles.stateContainer} align="center" justify="center">
                    <EmptyState
                        title="Your cart is empty"
                        description="Add some products to your cart to see them here."
                    />
                </Stack>
            </Stack>
        );
    }

    return (
        <Stack className={cn(styles.root, className)}>
            {items.map((item) => (
                <CartItemRow
                    key={item.id}
                    item={item}
                    currency={currency}
                    compact={compact}
                    validationIssues={getItemValidation(item.productId)?.issues}
                    controls={
                        <Stack className={styles.itemControls} direction="row" align="center" gap={12}>
                            <RemoveFromCartButton
                                productId={item.productId}
                                onRemove={removeItem}
                                className={styles.deleteBtn}
                            />
                            <CartQuantityStepper
                                productId={item.productId}
                                quantity={item.quantity}
                                maxQuantity={item.product.stock}
                                onQuantityChange={updateQuantity}
                                className={styles.quantityStepper}
                            />
                        </Stack>
                    }
                />
            ))}
        </Stack>
    );
};
