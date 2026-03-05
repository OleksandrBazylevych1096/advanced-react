import type {CurrencyType} from "@/shared/config";
import {cn} from "@/shared/lib";
import {EmptyState, ErrorState, Spinner} from "@/shared/ui";

import type {CartItem} from "../../model/types/CartSchema";
import {CartItemRow} from "../CartItemRow/CartItemRow";

import styles from "./CartList.module.scss";

interface CartItemValidation {
    issues: string[];
}

interface CartListProps {
    items: CartItem[];
    currency: CurrencyType;
    isLoading?: boolean;
    isError?: boolean;
    onRetry?: () => void;
    onRemove?: (productId: string) => void;
    onQuantityChange?: (productId: string, quantity: number) => void;
    getItemValidation?: (productId: string) => CartItemValidation | undefined;
    compact?: boolean;
    className?: string;
}

export const CartList = (props: CartListProps) => {
    const {
        items,
        currency,
        isLoading,
        isError,
        onRetry,
        onRemove,
        onQuantityChange,
        getItemValidation,
        compact,
        className,
    } = props;

    if (isLoading) {
        return (
            <div className={cn(styles.root, className)}>
                <div className={styles.stateContainer}>
                    <Spinner size="lg" />
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className={cn(styles.root, className)}>
                <div className={styles.stateContainer}>
                    <ErrorState message="Failed to load cart" onRetry={onRetry} />
                </div>
            </div>
        );
    }

    if (!items || items.length === 0) {
        return (
            <div className={cn(styles.root, className)}>
                <div className={styles.stateContainer}>
                    <EmptyState
                        title="Your cart is empty"
                        description="Add some products to your cart to see them here."
                    />
                </div>
            </div>
        );
    }

    return (
        <div className={cn(styles.root, {[styles.compact]: Boolean(compact)}, className)}>
            {items.map((item) => (
                <CartItemRow
                    key={item.id}
                    item={item}
                    currency={currency}
                    compact={compact}
                    validationIssues={getItemValidation?.(item.productId)?.issues}
                    onRemove={onRemove}
                    onQuantityChange={onQuantityChange}
                />
            ))}
        </div>
    );
};
