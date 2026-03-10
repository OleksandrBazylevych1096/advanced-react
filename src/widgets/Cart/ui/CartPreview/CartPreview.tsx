import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router";

import {useCartController, useCartValidationController} from "@/entities/cart";
import {selectIsAuthenticated, selectUserCurrency} from "@/entities/user";

import ShoppingCartIcon from "@/shared/assets/icons/ShoppingCart.svg?react";
import {AppRoutes, routePaths} from "@/shared/config";
import {cn, formatCurrency, useAppSelector, useLocalizedRoutePath} from "@/shared/lib";
import {AppIcon, Button, Dropdown, Progress, Stack, Typography} from "@/shared/ui";

import {CartItems} from "../CartItems/CartItems";

import styles from "./CartPreview.module.scss";

export const CartPreview = () => {
    const {i18n} = useTranslation();
    const navigate = useNavigate();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const currency = useAppSelector(selectUserCurrency);
    const getLocalizedPath = useLocalizedRoutePath();

    const {
        data: {cart},
        derived: {itemCount},
        status: {isLoading, isError},
    } = useCartController({isAuthenticated});

    const {
        derived: {hasIssues},
    } = useCartValidationController(cart?.items ?? [], {isAuthenticated});

    const openCart = () => {
        navigate(getLocalizedPath(routePaths[AppRoutes.CART]));
    };

    const hasItems = !!cart && cart.items.length > 0;
    const progressTarget = 800;
    const subtotal = cart?.totals.subtotal ?? 0;
    const progressPercent = Math.round((Math.min(subtotal, progressTarget) / progressTarget) * 100);

    return (
        <Dropdown className={styles.headerCart}>
            <Dropdown.Trigger className={styles.cartTrigger}>
                <Stack className={styles.trigger} direction="row" align="center" gap={6}>
                    <Stack className={styles.cartIcon} align="center" justify="center">
                        <AppIcon Icon={ShoppingCartIcon} size={22} />
                        {itemCount > 0 && (
                            <span className={cn(styles.badge, {[styles.error]: hasIssues})}>
                                {hasIssues ? "!" : itemCount > 99 ? "99+" : itemCount}
                            </span>
                        )}
                    </Stack>
                    <Typography as="span" className={styles.cartLabel} variant="bodySm" weight="medium">
                        Cart
                    </Typography>
                </Stack>
            </Dropdown.Trigger>

            <Dropdown.Content align="end" className={styles.dropdownContent}>
                <Stack className={styles.panelHeader}>
                    <Typography as="h3" className={styles.title} variant="heading" weight="semibold">
                        My Cart
                    </Typography>
                    <Typography as="span" variant="caption" tone="muted">
                        {itemCount} Items
                    </Typography>
                </Stack>

                <Stack className={styles.dropdownBody}>
                    <CartItems compact />
                </Stack>

                {hasItems && !isLoading && !isError && (
                    <Stack className={styles.footer}>
                        <Stack className={styles.shippingSection}>
                            <Typography className={styles.shippingText} variant="body" weight="semibold">
                                Cart value coverage: {progressPercent}% of {progressTarget}
                            </Typography>
                            <Progress
                                value={subtotal}
                                max={progressTarget}
                                trackClassName={styles.progressTrack}
                                fillClassName={styles.progressFill}
                                ariaLabel="Cart subtotal progress"
                            />
                        </Stack>

                        <Stack className={styles.subtotalRow} direction="row" align="center" justify="space-between">
                            <Typography as="span" variant="body" weight="medium" tone="muted">
                                Subtotal
                            </Typography>
                            <Typography as="span" variant="heading" weight="semibold">
                                {formatCurrency(currency, i18n.language, subtotal)}
                            </Typography>
                        </Stack>

                        <Button onClick={openCart} fullWidth theme="primary" size="md" className={styles.viewCartBtn}>
                            <AppIcon Icon={ShoppingCartIcon} size={16} />
                            View Cart
                        </Button>
                    </Stack>
                )}
            </Dropdown.Content>
        </Dropdown>
    );
};
