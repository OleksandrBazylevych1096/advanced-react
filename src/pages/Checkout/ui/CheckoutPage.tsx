import {useTranslation} from "react-i18next";

import {ReviewOrderItems} from "@/widgets/ReviewOrderItems";

import {Coupon, applyCouponReducer} from "@/features/checkout/apply-coupon";
import {DeliveryTip, chooseDeliveryTipReducer} from "@/features/checkout/choose-delivery-tip";
import {PlaceOrder} from "@/features/checkout/place-order";

import {OrderSummaryCard} from "@/entities/order";

import ArrowLeft from "@/shared/assets/icons/ArrowLeft.svg?react";
import {DynamicModuleLoader} from "@/shared/lib/state";
import {AppIcon} from "@/shared/ui/AppIcon";
import {Button} from "@/shared/ui/Button";
import {Stack} from "@/shared/ui/Stack";
import {Typography} from "@/shared/ui/Typography";

import {useCheckoutPageController} from "../model/controllers/useCheckoutPageController";

import {CheckoutDeliveryInfoCard} from "./CheckoutDeliveryInfoCard/CheckoutDeliveryInfoCard";
import styles from "./CheckoutPage.module.scss";
import {CheckoutPageSkeleton} from "./CheckoutPageSkeleton";

const reducers = {
    chooseDeliveryTip: chooseDeliveryTipReducer,
    applyCoupon: applyCouponReducer,
};

const CheckoutPage = () => {
    const {t} = useTranslation("checkout");
    const {
        data: {summary, defaultAddress, deliverySelection, tip, couponCode},
        status: {isLoading, isError},
        actions: {goToCartPage, openManageShippingAddressModal},
    } = useCheckoutPageController();

    const summaryRows = summary
        ? [
              {label: t("summary.itemsTotal"), amount: summary.totals.subtotal},
              {label: t("summary.deliveryFee"), amount: summary.totals.estimatedShipping},
              {label: t("summary.serviceFee"), amount: summary.totals.estimatedTax},
              {label: t("summary.tip"), amount: tip},
              {label: t("summary.coupon"), amount: -(summary.totals.discountAmount ?? 0)},
          ]
        : [];

    if (isLoading) {
        return <CheckoutPageSkeleton />;
    }

    if (isError || !summary) {
        return (
            <Stack className={styles.centerState} align="center" justify="center" gap={8}>
                <Typography tone="danger" variant="heading" weight="bold">
                    {t("checkoutMainSection.failedToLoadSummary")}
                </Typography>
            </Stack>
        );
    }

    return (
        <DynamicModuleLoader reducers={reducers} removeAfterUnmount>
            <Stack as="section" className={styles.layout} gap={24}>
                <Stack className={styles.mainColumn} gap={24}>
                    <Stack direction="row" align="center" gap={12}>
                        <Button
                            type="button"
                            theme="tertiary"
                            form="circle"
                            size="lg"
                            onClick={goToCartPage}
                            data-testid="checkout-go-back-trigger"
                        >
                            <AppIcon Icon={ArrowLeft} size={18} />
                        </Button>
                        <Typography as="h1" variant="display" weight="bold">
                            {t("checkoutTitle")}
                        </Typography>
                    </Stack>

                    <CheckoutDeliveryInfoCard
                        address={defaultAddress}
                        onOpenManageShippingAddressModal={openManageShippingAddressModal}
                    />
                    <Stack className={styles.cardSurface}>
                        <ReviewOrderItems items={summary.items} />
                    </Stack>
                </Stack>

                <Stack gap={16} className={styles.sidebarColumn}>
                    <Stack className={styles.cardSurface}>
                        <OrderSummaryCard rows={summaryRows} totalAmount={summary.totals.total} />
                    </Stack>
                    <Stack className={styles.cardSurface}>
                        <DeliveryTip />
                    </Stack>
                    <Stack className={styles.cardSurface}>
                        <Coupon />
                    </Stack>
                    <Stack className={styles.cardSurface}>
                        <PlaceOrder
                            summary={summary}
                            deliverySelection={deliverySelection}
                            tip={tip}
                            couponCode={couponCode}
                        />
                    </Stack>
                </Stack>
            </Stack>
        </DynamicModuleLoader>
    );
};

export default CheckoutPage;
