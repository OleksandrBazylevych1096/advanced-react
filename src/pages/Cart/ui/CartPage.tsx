import {useTranslation} from "react-i18next";

import {BestSellingProducts} from "@/widgets/BestSellingProducts";
import {Header} from "@/widgets/Header";

import {useClearCartController} from "@/features/clear-cart";
import {useRemoveFromCartController} from "@/features/remove-from-cart";
import {useUpdateCartItemQuantityController} from "@/features/update-cart-item-quantity";

import {CartList, useCartController, useCartValidationController} from "@/entities/cart";
import {selectAccessToken, selectUserCurrency, selectUserData} from "@/entities/user";

import ShoppingCartIcon from "@/shared/assets/icons/ShoppingCart.svg?react";
import {cn, formatCurrency, useAppSelector, useToast} from "@/shared/lib";
import {AppIcon, AppPage, Button, Grid, Progress, Typography} from "@/shared/ui";

import styles from "./CartPage.module.scss";

const CartPage = () => {
    const {i18n} = useTranslation();
    const currency = useAppSelector(selectUserCurrency);
    const toast = useToast();
    const user = useAppSelector(selectUserData);
    const accessToken = useAppSelector(selectAccessToken);
    const isAuthenticated = Boolean(user && accessToken);

    const {
        data: {cart},
        status: {isLoading, isError},
        actions: {refetch},
    } = useCartController({isAuthenticated});
    const {
        status: {isClearing},
        actions: {clearCart},
    } = useClearCartController();
    const {
        actions: {removeItem},
    } = useRemoveFromCartController();
    const {
        actions: {updateQuantity},
    } = useUpdateCartItemQuantityController({
        onError: () => toast.error("Failed to update cart"),
    });

    const {
        derived: {hasIssues},
        status: {isValidating},
        actions: {getItemValidation},
    } = useCartValidationController(cart?.items ?? [], {isAuthenticated});

    const proceedToCheckout = async () => {
        console.log("Proceeding to checkout...");
    };

    const isEmpty = !cart || cart.items.length === 0;
    const progressTarget = 800;
    const summaryProgressValue = cart?.totals.subtotal ?? 0;

    return (
        <AppPage>
            <Header />

            <AppPage.Content>
                {isEmpty && !isLoading && !isError ? (
                    <CartList items={[]} currency={currency} />
                ) : (
                    <Grid className={styles.content} gap={32}>
                        <div className={styles.itemsSection}>
                            <div className={styles.itemsList}>
                                <CartList
                                    items={cart?.items ?? []}
                                    currency={currency}
                                    isLoading={isLoading}
                                    isError={isError}
                                    onRetry={refetch}
                                    onRemove={removeItem}
                                    onQuantityChange={updateQuantity}
                                    getItemValidation={getItemValidation}
                                />
                            </div>

                            {!isEmpty && !isLoading && !isError && (
                                <div className={styles.itemsFooter}>
                                    <Button
                                        theme="ghost"
                                        size="sm"
                                        onClick={clearCart}
                                        isLoading={isClearing}
                                        className={styles.clearBtn}
                                    >
                                        Clear Cart
                                    </Button>
                                </div>
                            )}
                        </div>

                        {!isEmpty && !isLoading && !isError && cart && (
                            <aside className={styles.summary}>
                                <div className={styles.summaryCard}>
                                    <div className={styles.summaryProgress}>
                                        <Progress
                                            value={summaryProgressValue}
                                            max={progressTarget}
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

                                    <div className={styles.summaryRows}>
                                        <div className={styles.summaryRow}>
                                            <span>Items total</span>
                                            <span>
                                                {formatCurrency(
                                                    currency,
                                                    i18n.language,
                                                    cart.totals.subtotal,
                                                )}
                                            </span>
                                        </div>
                                        <div className={styles.summaryRow}>
                                            <span>Delivery fee</span>
                                            <span>
                                                {formatCurrency(
                                                    currency,
                                                    i18n.language,
                                                    cart.totals.estimatedShipping,
                                                )}
                                            </span>
                                        </div>
                                        {cart.totals.estimatedTax > 0 && (
                                            <div className={styles.summaryRow}>
                                                <span>Estimated tax</span>
                                                <span>
                                                    {formatCurrency(
                                                        currency,
                                                        i18n.language,
                                                        cart.totals.estimatedTax,
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className={styles.summaryDivider} />

                                    <div className={cn(styles.summaryRow, styles.summaryTotal)}>
                                        <span>Subtotal</span>
                                        <span>
                                            {formatCurrency(
                                                currency,
                                                i18n.language,
                                                cart.totals.total,
                                            )}
                                        </span>
                                    </div>

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
                                            {formatCurrency(
                                                currency,
                                                i18n.language,
                                                cart.totals.total,
                                            )}
                                        </span>
                                    </Button>
                                    {hasIssues && (
                                        <Typography
                                            className={styles.checkoutError}
                                            variant="bodySm"
                                            tone="danger"
                                        >
                                            Please resolve cart issues before checkout
                                        </Typography>
                                    )}
                                </div>
                            </aside>
                        )}
                    </Grid>
                )}
                <BestSellingProducts />
            </AppPage.Content>
        </AppPage>
    );
};

export default CartPage;
