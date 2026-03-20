import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router";

import {CartProgressSection} from "@/widgets/Cart";

import {type Cart, useCartValidationController} from "@/entities/cart";
import {OrderSummaryCard, type OrderSummaryRow} from "@/entities/order";
import {selectIsAuthenticated, selectUserCurrency} from "@/entities/user";

import ShoppingCartIcon from "@/shared/assets/icons/ShoppingCart.svg?react";
import {AppRoutes, routePaths} from "@/shared/config";
import {formatCurrency, useAppSelector, useLocalizedRoutePath} from "@/shared/lib";
import {AppIcon, Button, Typography} from "@/shared/ui";

import styles from "../CartPage.module.scss";

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
        derived: {hasIssues},
        status: {isValidating},
    } = useCartValidationController(cart?.items ?? [], {isAuthenticated});

    const proceedToCheckout = () => {
        navigate(getLocalizedPath(routePaths[AppRoutes.CHECKOUT]));
    };

    if (!cart || cart.items.length === 0 || error) {
        return null;
    }

    const rows: OrderSummaryRow[] = [
        {label: "Items total", amount: cart.totals.subtotal},
        {label: "Delivery fee", amount: cart.totals.estimatedShipping},
    ];

    if (cart.totals.estimatedTax > 0) {
        rows.push({label: "Estimated tax", amount: cart.totals.estimatedTax});
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

                <OrderSummaryCard
                    rows={rows}
                    totalAmount={cart.totals.total}
                    className={styles.summaryTotals}
                />

                <Button
                    fullWidth
                    theme="primary"
                    size="lg"
                    className={styles.checkoutBtn}
                    onClick={proceedToCheckout}
                    disabled={hasIssues || isValidating}
                >
                    <AppIcon Icon={ShoppingCartIcon} size={18} />
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
