import {CartQuantityStepper} from "@/features/update-cart-item-quantity";

import {CartItemRow} from "@/entities/cart";

import {cn} from "@/shared/lib/styling";
import {Stack} from "@/shared/ui/Stack";
import {EmptyState, ErrorState} from "@/shared/ui/StateViews";
import {Typography} from "@/shared/ui/Typography";

import {RemoveFromCartButton} from "../RemoveFromCartButton/RemoveFromCartButton";

import styles from "./CartItems.module.scss";
import {CartItemsSkeleton} from "./CartItemsSkeleton";
import {useCartItems} from "./useCartItems/useCartItems.ts";

interface CartItemsProps {
    compact?: boolean;
    className?: string;
}

export const CartItems = ({compact, className}: CartItemsProps) => {
    const {
        data: {items, currency},
        derived: {itemsCount},
        status: {isLoading, isError},
        actions: {refetch, removeItem, updateQuantity, getItemValidation},
    } = useCartItems();

    if (isLoading) {
        return (
            <Stack className={cn(styles.root, className)}>
                <CartItemsSkeleton compact={compact} />
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
            <Stack className={styles.panelHeader}>
                <Typography as="h3" className={styles.title} variant="heading" weight="semibold">
                    My Cart
                </Typography>
                <Typography as="span" variant="caption" tone="muted">
                    {itemsCount} Items
                </Typography>
            </Stack>
            {items.map((item) => (
                <CartItemRow
                    key={item.id}
                    item={item}
                    currency={currency}
                    compact={compact}
                    validationIssues={getItemValidation(item.product.id)?.issues}
                    controls={
                        <Stack direction="row" align="center" gap={12}>
                            <RemoveFromCartButton
                                productId={item.product.id}
                                onRemove={removeItem}
                                className={styles.deleteBtn}
                            />
                            <CartQuantityStepper
                                productId={item.product.id}
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
