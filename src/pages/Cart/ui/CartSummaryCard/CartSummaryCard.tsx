import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router";

import {type Cart, useCartValidation} from "@/entities/cart";
import {OrderSummaryCard, type OrderSummaryRow} from "@/entities/order";
import {selectIsAuthenticated, selectUserCurrency} from "@/entities/user";

import ShoppingCartIcon from "@/shared/assets/icons/ShoppingCart.svg?react";
import {AppRoutes, routePaths} from "@/shared/config";
import {formatCurrency} from "@/shared/lib/formatting";
import {useLocalizedRoutePath} from "@/shared/lib/routing";
import {useAppSelector} from "@/shared/lib/state";
import {AppIcon} from "@/shared/ui/AppIcon";
import {Button} from "@/shared/ui/Button";
import {Progress} from "@/shared/ui/Progress";
import {Stack} from "@/shared/ui/Stack";
import {Typography} from "@/shared/ui/Typography";

import styles from "../CartPage/CartPage.module.scss";

interface CartSummaryCardProps {
    cart: Cart | undefined;
    error?: boolean;
    isFetching?: boolean;
}

export const CartSummaryCard = ({cart, error}: CartSummaryCardProps) => {
    const {i18n} = useTranslation();
    const navigate = useNavigate();
    const getLocalizedPath = useLocalizedRoutePath();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const currency = useAppSelector(selectUserCurrency);
    const {
        data: {hasIssues},
        status: {isValidating},
    } = useCartValidation(cart?.items ?? [], {isAuthenticated});

    const proceedToCheckout = () => {
        navigate(getLocalizedPath(routePaths[AppRoutes.CHECKOUT]));
    };

    if (!cart || cart.items.length === 0 || error) {
        return null;
    }

    const rows: OrderSummaryRow[] = [
        {label: "Items total", amount: cart.totals.subtotal},
        {label: "Delivery fee", amount: cart.totals.estimatedShipping},
        {label: "Estimated tax", amount: cart.totals.estimatedTax},
    ];

    return (
        <aside>
            <div className={styles.summaryCard}>
                <div className={styles.summaryProgress}>
                    <Stack direction="column" gap={12}>
                        <Typography variant="body" weight="semibold">
                            {cart.totals.subtotal >= cart.totals.freeShippingTarget
                                ? "Free delivery"
                                : `Get free delivery (${formatCurrency(currency, i18n.language, cart.totals.freeShippingTarget - cart.totals.subtotal)} more)`}
                        </Typography>
                        <Progress
                            value={cart.totals.subtotal}
                            max={cart.totals.freeShippingTarget}
                            ariaLabel={"Order completion progress"}
                        />
                    </Stack>
                </div>

                <OrderSummaryCard currency={currency} rows={rows} totalAmount={cart.totals.total} />

                <Button
                    fullWidth
                    theme="primary"
                    size="lg"
                    className={styles.checkoutBtn}
                    onClick={proceedToCheckout}
                    disabled={hasIssues || isValidating}
                >
                    <AppIcon Icon={ShoppingCartIcon} size={18} />
                    <Typography>Checkout</Typography>
                    <Typography>
                        {formatCurrency(currency, i18n.language, cart.totals.total)}
                    </Typography>
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
