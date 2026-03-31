import {useTranslation} from "react-i18next";
import {useNavigate, useParams} from "react-router";

import {mapOrderItemsToCartItems} from "@/pages/Order/lib/mapOrderItemsToCartItems/mapOrderItemsToCartItems";

import {ReviewOrderItems} from "@/widgets/ReviewOrderItems";

import type {CartItem} from "@/entities/cart";
import {OrderSummaryCard, useGetOrderByIdQuery} from "@/entities/order";

import ArrowLeft from "@/shared/assets/icons/ArrowLeft.svg?react";
import {AppRoutes, routePaths} from "@/shared/config";
import {useLocalizedRoutePath} from "@/shared/lib/routing";
import {AppIcon} from "@/shared/ui/AppIcon";
import {Button} from "@/shared/ui/Button";
import {Stack} from "@/shared/ui/Stack";
import {Typography} from "@/shared/ui/Typography";

import {OrderDeliveryAddressCard} from "./OrderDeliveryAddressCard/OrderDeliveryAddressCard";
import styles from "./OrderPage.module.scss";
import {OrderPageSkeleton} from "./OrderPageSkeleton";
import {OrderPaymentInfoCard} from "./OrderPaymentInfoCard/OrderPaymentInfoCard";
import {OrderTrackingSection} from "./OrderTrackingSection/OrderTrackingSection";

const OrderPage = () => {
    const {t, i18n} = useTranslation("checkout");
    const {id: orderId} = useParams<{id: string}>();
    const navigate = useNavigate();
    const getLocalizedPath = useLocalizedRoutePath();

    const {
        data: order,
        isLoading,
        isError,
    } = useGetOrderByIdQuery(
        {
            orderId: orderId ?? "",
            locale: i18n.language,
        },
        {
            skip: !orderId,
        },
    );

    const goToCartPage = () => {
        navigate(getLocalizedPath(routePaths[AppRoutes.CART]));
    };

    if (isLoading) {
        return <OrderPageSkeleton />;
    }

    if (isError || !order) {
        return (
            <Stack className={styles.centerState} align="center" justify="center" gap={8}>
                <Typography tone="danger" variant="heading" weight="bold">
                    {t("order.errorTitle")}
                </Typography>
                <Typography tone="muted">{t("order.errorDescription")}</Typography>
            </Stack>
        );
    }

    const summaryRows = [
        {label: t("summary.itemsTotal"), amount: order.subtotalAmount},
        {label: t("summary.deliveryFee"), amount: order.shippingAmount},
        {label: t("summary.serviceFee"), amount: order.taxAmount},
        {label: t("summary.tip"), amount: order.tipAmount},
        {label: t("summary.coupon"), amount: -order.discountAmount},
    ];

    const reviewItems: CartItem[] = mapOrderItemsToCartItems(order.orderItems);
    const deliveredEvent = order.timeline.events.find((event) => event.status === "DELIVERED");
    const isOrderDelivered = deliveredEvent?.state === "done";
    const pageTitle = isOrderDelivered
        ? t("order.pageTitle.delivered")
        : t("order.pageTitle.inProgress");

    return (
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
                        {pageTitle}
                    </Typography>
                </Stack>

                <OrderTrackingSection order={order} />

                <Stack className={styles.cardSurface}>
                    <ReviewOrderItems items={reviewItems} />
                </Stack>
            </Stack>

            <Stack gap={16} className={styles.sidebarColumn}>
                <Stack className={styles.cardSurface}>
                    <OrderSummaryCard rows={summaryRows} totalAmount={order.totalAmount} />
                </Stack>
                <OrderPaymentInfoCard
                    brand={order.paymentCardBrand}
                    last4={order.paymentCardLast4}
                />
                <OrderDeliveryAddressCard shippingAddress={order.shippingAddress ?? undefined} />
            </Stack>
        </Stack>
    );
};

export default OrderPage;
