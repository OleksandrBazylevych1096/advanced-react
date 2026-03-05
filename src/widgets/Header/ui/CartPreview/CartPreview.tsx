import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router";


import {useRemoveFromCartController} from "@/features/remove-from-cart";
import {useUpdateCartItemQuantityController} from "@/features/update-cart-item-quantity";

import {CartList, useCartController, useCartValidationController} from "@/entities/cart";
import {selectAccessToken, selectUserCurrency, selectUserData} from "@/entities/user";

import ShoppingCartIcon from "@/shared/assets/icons/ShoppingCart.svg?react";
import {AppRoutes, routePaths} from "@/shared/config";
import {cn, formatCurrency, useAppSelector, useLocalizedRoutePath, useToast} from "@/shared/lib";
import {AppIcon, Button, Dropdown, Progress, Typography} from "@/shared/ui";

import styles from "./CartPreview.module.scss";

export const CartPreview = () => {
    const navigate = useNavigate();
    const getLocalizedPath = useLocalizedRoutePath();
    const {i18n} = useTranslation();
    const currency = useAppSelector(selectUserCurrency);
    const toast = useToast();
    const user = useAppSelector(selectUserData);
    const accessToken = useAppSelector(selectAccessToken);
    const isAuthenticated = Boolean(user && accessToken);

    const {
        data: {cart},
        derived: {itemCount},
        status: {isLoading, isError},
        actions: {refetch},
    } = useCartController({isAuthenticated});

    const {
        actions: {removeItem},
    } = useRemoveFromCartController();
    const {
        actions: {updateQuantity},
    } = useUpdateCartItemQuantityController({
        onError: () => toast.error("Failed to update cart"),
    });
    const {
        actions: {getItemValidation},
        derived: {hasIssues},
    } = useCartValidationController(cart?.items ?? [], {isAuthenticated});

    const openCart = () => {
        navigate(getLocalizedPath(routePaths[AppRoutes.CART]));
    };

    const hasItems = !!cart && cart.items.length > 0;
    const progressTarget = 800;
    const previewProgressValue = cart?.totals.subtotal ?? 0;
    const previewProgressPercent = Math.round(
        (Math.min(previewProgressValue, progressTarget) / progressTarget) * 100,
    );

    return (
        <Dropdown className={styles.headerCart}>
            <Dropdown.Trigger className={styles.trigger}>
                <div className={styles.cartIcon}>
                    <AppIcon Icon={ShoppingCartIcon} size={22}/>
                    {itemCount > 0 && (
                        <span className={cn(styles.badge, {[styles.error]: hasIssues})}>
                            {hasIssues ? "!" : itemCount > 99 ? "99+" : itemCount}
                        </span>
                    )}
                </div>
                <Typography as="span" className={styles.cartLabel} variant="bodySm" weight="medium">
                    Cart
                </Typography>
            </Dropdown.Trigger>

            <Dropdown.Content align="end" className={styles.dropdownContent}>
                <div className={styles.panelHeader}>
                    <Typography
                        as="h3"
                        className={styles.title}
                        variant="heading"
                        weight="semibold"
                    >
                        My Cart
                    </Typography>
                    <Typography as="span" variant="caption" tone="muted">
                        {itemCount} Items
                    </Typography>
                </div>

                <div className={styles.dropdownBody}>
                    <CartList
                        items={cart?.items ?? []}
                        currency={currency}
                        isLoading={isLoading}
                        isError={isError}
                        onRetry={refetch}
                        onRemove={removeItem}
                        onQuantityChange={updateQuantity}
                        getItemValidation={getItemValidation}
                        compact
                    />
                </div>

                {hasItems && cart && (
                    <div className={styles.dropdownFooter}>
                        <div className={styles.shippingSection}>
                            <Typography
                                className={styles.shippingText}
                                variant="body"
                                weight="semibold"
                            >
                                Cart value coverage: {previewProgressPercent}% of {progressTarget}
                            </Typography>
                            <Progress
                                value={previewProgressValue}
                                max={progressTarget}
                                trackClassName={styles.progressTrack}
                                fillClassName={styles.progressFill}
                                ariaLabel="Cart subtotal progress"
                            />
                        </div>

                        <div className={styles.subtotalRow}>
                            <Typography as="span" variant="body" weight="medium" tone="muted">
                                Subtotal
                            </Typography>
                            <Typography as="span" variant="heading" weight="semibold">
                                {formatCurrency(currency, i18n.language, cart.totals.subtotal)}
                            </Typography>
                        </div>

                        <Button
                            onClick={openCart}
                            fullWidth
                            theme="primary"
                            size="md"
                            className={styles.viewCartBtn}
                        >
                            <AppIcon Icon={ShoppingCartIcon} size={16}/>
                            <Typography as="span" variant="bodySm" weight="semibold">
                                View Cart
                            </Typography>
                        </Button>
                    </div>
                )}
            </Dropdown.Content>
        </Dropdown>
    );
};
