import {useTranslation} from "react-i18next";
import {useNavigate, useParams} from "react-router";

import {mapOrderItemsToCartItems} from "@/pages/Order/lib/mapOrderItemsToCartItems/mapOrderItemsToCartItems";

import type {CartItem} from "@/entities/cart";
import {OrderStatus, type OrderSummaryRow, useGetOrderByIdQuery} from "@/entities/order";

import {AppRoutes, routePaths} from "@/shared/config";
import {useLocalizedRoutePath} from "@/shared/lib/routing";

export const useOrderPage = () => {
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

    const hasError = isError || !order;

    const summaryRows: OrderSummaryRow[] = order
        ? [
              {label: t("summary.itemsTotal"), amount: order.subtotalAmount},
              {label: t("summary.deliveryFee"), amount: order.shippingAmount},
              {label: t("summary.serviceFee"), amount: order.taxAmount},
              {label: t("summary.tip"), amount: order.tipAmount},
              {label: t("summary.coupon"), amount: -order.discountAmount},
          ]
        : [];

    const reviewItems: CartItem[] = order ? mapOrderItemsToCartItems(order.orderItems) : [];
    const deliveredEvent = order?.timeline.events.find((event) => event.status === "DELIVERED");
    const isOrderDelivered = deliveredEvent?.state === "done";
    const canCancelOrder =
        order?.status === OrderStatus.PENDING || order?.status === OrderStatus.CONFIRMED;

    const pageTitle = isOrderDelivered
        ? t("order.pageTitle.delivered")
        : t("order.pageTitle.inProgress");

    const goToHomePage = () => {
        navigate(getLocalizedPath(routePaths[AppRoutes.HOME]));
    };

    return {
        data: {
            order,
            summaryRows,
            reviewItems,
            pageTitle,
        },
        status: {
            isLoading,
            hasError,
            canCancelOrder,
        },
        actions: {
            goToHomePage,
        },
    };
};
