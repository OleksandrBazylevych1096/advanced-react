import {useTranslation} from "react-i18next";

import {ReviewOrderItems} from "@/widgets/ReviewOrderItems";

import {OrderSummaryCard} from "@/entities/order";

import ArrowLeft from "@/shared/assets/icons/ArrowLeft.svg?react";
import {cn} from "@/shared/lib/styling";
import {AppIcon} from "@/shared/ui/AppIcon";
import {Button} from "@/shared/ui/Button";
import {Stack} from "@/shared/ui/Stack";
import {Typography} from "@/shared/ui/Typography";

import {CancelOrder} from "../CancelOrder/CancelOrder";
import {OrderDeliveryAddressCard} from "../OrderDeliveryAddressCard/OrderDeliveryAddressCard";
import {OrderPaymentInfoCard} from "../OrderPaymentInfoCard/OrderPaymentInfoCard";
import {OrderTrackingSection} from "../OrderTrackingSection/OrderTrackingSection";

import styles from "./OrderPage.module.scss";
import {OrderPageSkeleton} from "./OrderPageSkeleton";
import {useOrderPage} from "./useOrderPage/useOrderPage.ts";

const OrderPage = () => {
    const {t} = useTranslation("checkout");
    const {
        data: {order, summaryRows, reviewItems, pageTitle},
        status: {isLoading, hasError, canCancelOrder},
        actions: {goToHomePage},
    } = useOrderPage();

    if (isLoading) {
        return <OrderPageSkeleton/>;
    }

    if (hasError || !order) {
        return (
            <Stack className={styles.centerState} align="center" justify="center" gap={8}>
                <Typography tone="danger" variant="heading" weight="bold">
                    {t("order.errorTitle")}
                </Typography>
                <Typography tone="muted">{t("order.errorDescription")}</Typography>
            </Stack>
        );
    }

    return (
        <Stack as="section" className={styles.pageLayout} gap={24}>
            <Stack gap={24}>
                <Stack className={styles.layout} gap={24}>
                    <Stack className={styles.mainColumn} gap={24}>
                        <Stack direction="row" align="center" gap={12}>
                            <Button
                                type="button"
                                theme="tertiary"
                                form="circle"
                                size="lg"
                                onClick={goToHomePage}
                                data-testid="checkout-go-back-trigger"
                            >
                                <AppIcon Icon={ArrowLeft} size={18}/>
                            </Button>
                            <Typography as="h1" variant="display" weight="bold">
                                {pageTitle}
                            </Typography>
                        </Stack>

                        <OrderTrackingSection order={order}/>

                        <Stack className={styles.cardSurface}>
                            <ReviewOrderItems currency={order.currency} items={reviewItems}/>
                        </Stack>
                    </Stack>

                    <Stack gap={16} className={styles.sidebarColumn}>
                        <Stack className={styles.cardSurface}>
                            <OrderSummaryCard currency={order.currency} rows={summaryRows}
                                              totalAmount={order.totalAmount}/>
                        </Stack>
                        <OrderPaymentInfoCard
                            brand={order.paymentCardBrand}
                            last4={order.paymentCardLast4}
                        />
                        <OrderDeliveryAddressCard
                            shippingAddress={order.shippingAddress ?? undefined}
                        />
                    </Stack>
                </Stack>

                {canCancelOrder && (
                    <Stack
                        className={cn(styles.cancelOrderSection, styles.cardSurface)}
                        justify={"space-between"}
                        direction={"row"}
                    >
                        <Typography weight={"medium"} variant={"heading"}>
                            {t("order.cancelOrder.description")}
                        </Typography>
                        <CancelOrder orderId={order.id}/>
                    </Stack>
                )}
            </Stack>
        </Stack>
    );
};

export default OrderPage;
