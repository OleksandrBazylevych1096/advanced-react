import {useTranslation} from "react-i18next";

import {CartProgressSection} from "@/widgets/Cart";

import {type Cart, useCartValidationController} from "@/entities/cart";
import {selectIsAuthenticated, selectUserCurrency} from "@/entities/user";

import ShoppingCartIcon from "@/shared/assets/icons/ShoppingCart.svg?react";
import {cn, formatCurrency, useAppSelector} from "@/shared/lib";
import {AppIcon, Button, Stack, Typography} from "@/shared/ui";

import styles from "./CartPage.module.scss";

interface CartSummaryCardProps {
    cart: Cart | undefined;
    error?: boolean;
    isFetching?: boolean;
}

export const CartSummaryCard = ({cart, error}: CartSummaryCardProps) => {
    const {i18n} = useTranslation();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const currency = useAppSelector(selectUserCurrency);
    const {
        derived: {hasIssues},
        status: {isValidating},
    } = useCartValidationController(cart?.items ?? [], {isAuthenticated});

    const proceedToCheckout = () => {
        console.log("Proceeding to checkout...");
    };

    if (!cart || cart.items.length === 0 || error) {
        return null;
    }

    return (
        <aside>
            <div className={styles.summaryCard}>
                <div className={styles.summaryProgress}>
                    <CartProgressSection
                        value={cart.totals.subtotal}
                        target={cart.totals.freeShippingTarget}
                        ariaLabel="Order completion progress"
                    />
                </div>

                <Typography
                    as="h2"
                    className={styles.summaryTitle}
                    variant="display"
                    tone="default"
                    weight="bold"
                >
                    Order Summary
                </Typography>

                <Stack className={styles.summaryRows} gap={12}>
                    <Stack
                        className={styles.summaryRow}
                        direction="row"
                        justify="space-between"
                        align="center"
                    >
                        <Typography as="span">Items total</Typography>
                        <Typography as="span" weight="medium">
                            {formatCurrency(currency, i18n.language, cart.totals.subtotal)}
                        </Typography>
                    </Stack>

                    <Stack
                        className={styles.summaryRow}
                        direction="row"
                        justify="space-between"
                        align="center"
                    >
                        <Typography as="span">Delivery fee</Typography>
                        <Typography as="span" weight="medium">
                            {formatCurrency(currency, i18n.language, cart.totals.estimatedShipping)}
                        </Typography>
                    </Stack>

                    {cart.totals.estimatedTax > 0 && (
                        <Stack
                            className={styles.summaryRow}
                            direction="row"
                            justify="space-between"
                            align="center"
                        >
                            <Typography as="span">Estimated tax</Typography>
                            <Typography as="span" weight="medium">
                                {formatCurrency(currency, i18n.language, cart.totals.estimatedTax)}
                            </Typography>
                        </Stack>
                    )}
                </Stack>

                <div className={styles.summaryDivider}/>

                <Stack
                    className={cn(styles.summaryRow, styles.summaryTotal)}
                    direction="row"
                    justify="space-between"
                    align="center"
                >
                    <Typography as="span" weight="bold">
                        Subtotal
                    </Typography>
                    <Typography as="span" weight="bold">
                        {formatCurrency(currency, i18n.language, cart.totals.total)}
                    </Typography>
                </Stack>

                <Button
                    fullWidth
                    theme="primary"
                    size="lg"
                    className={styles.checkoutBtn}
                    onClick={proceedToCheckout}
                    disabled={hasIssues || isValidating}
                >
                    <AppIcon Icon={ShoppingCartIcon} size={18}/>
                    <span>Checkout</span>
                    <span className={styles.checkoutTotal}>
                        {formatCurrency(currency, i18n.language, cart.totals.total)}
                    </span>
                </Button>

                {hasIssues && (
                    <Typography className={styles.checkoutError} variant="bodySm" tone="danger">
                        Please resolve cart issues before checkout
                    </Typography>
                )}
            </div>
        </aside>
    );
};
