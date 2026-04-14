import {useTranslation} from "react-i18next";

import {CartQuantityStepper} from "@/features/update-cart-item-quantity";

import {CartItemRow, useCart, useCartValidation} from "@/entities/cart";
import {selectIsAuthenticated, selectUserCurrency} from "@/entities/user";

import {useAppSelector} from "@/shared/lib/state";
import {cn} from "@/shared/lib/styling";
import {Stack} from "@/shared/ui/Stack";
import {EmptyState, ErrorState} from "@/shared/ui/StateViews";
import {Typography} from "@/shared/ui/Typography";

import {RemoveFromCartButton} from "../RemoveFromCartButton/RemoveFromCartButton";

import styles from "./CartItemsList.module.scss";
import {CartItemsListSkeleton} from "./CartItemsListSkeleton.tsx";

interface CartItemsProps {
    compact?: boolean;
    className?: string;
}

export const CartItemsList = ({compact, className}: CartItemsProps) => {
    const {t} = useTranslation();
    const currency = useAppSelector(selectUserCurrency);
    const isAuthenticated = useAppSelector(selectIsAuthenticated);

    const {
        data: {cart},
        status: {isLoading, isError},
        actions: {refetch},
    } = useCart({isAuthenticated});

    const {
        actions: {getItemValidation},
    } = useCartValidation(cart?.items ?? [], {isAuthenticated});

    if (isLoading) {
        return (
            <Stack className={cn(styles.root, className)}>
                <CartItemsListSkeleton compact={compact} />
            </Stack>
        );
    }

    if (isError) {
        return (
            <Stack className={cn(styles.root, className)}>
                <Stack className={styles.stateContainer} align="center" justify="center">
                    <ErrorState message={t("cart.errorLoad")} onRetry={refetch} />
                </Stack>
            </Stack>
        );
    }

    if (!cart?.items.length) {
        return (
            <Stack className={cn(styles.root, className)}>
                <Stack className={styles.stateContainer} align="center" justify="center">
                    <EmptyState
                        title={t("cart.emptyTitle")}
                        description={t("cart.emptyDescription")}
                    />
                </Stack>
            </Stack>
        );
    }

    return (
        <Stack className={cn(styles.root, className)}>
            <Stack className={styles.panelHeader}>
                <Typography as="h3" className={styles.title} variant="heading" weight="semibold">
                    {t("cart.title")}
                </Typography>
                <Typography as="span" variant="caption" tone="muted">
                    {t("cart.itemsCount", {count: cart?.items.length ?? 0})}
                </Typography>
            </Stack>
            {cart?.items.map((item) => (
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
                                className={styles.deleteBtn}
                            />
                            <CartQuantityStepper
                                productId={item.product.id}
                                quantity={item.quantity}
                                maxQuantity={item.product.stock}
                                className={styles.quantityStepper}
                            />
                        </Stack>
                    }
                />
            ))}
        </Stack>
    );
};
