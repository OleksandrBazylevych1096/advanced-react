import {useMemo} from "react";
import {useTranslation} from "react-i18next";

import {selectApplyCouponCode} from "@/features/checkout/apply-coupon";
import {useGetDeliverySelectionQuery} from "@/features/checkout/choose-delivery-date";
import {selectChooseDeliveryTipAmount} from "@/features/checkout/choose-delivery-tip";
import {
    buildCheckoutSummaryRows,
    calculateCheckoutTotals,
    useGetCheckoutSummaryQuery,
} from "@/features/checkout/place-order";

import {selectIsAuthenticated, selectUserCurrency} from "@/entities/user";

import {createControllerResult, useAppSelector} from "@/shared/lib/state";

export const useCheckoutSidebarController = () => {
    const {i18n, t} = useTranslation("checkout");
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const currency = useAppSelector(selectUserCurrency);
    const tip = useAppSelector(selectChooseDeliveryTipAmount);
    const couponCode = useAppSelector(selectApplyCouponCode);

    const {data: deliverySelectionResponse} = useGetDeliverySelectionQuery({locale: i18n.language});
    const deliverySelection = useMemo(
        () =>
            deliverySelectionResponse
                ? {
                      deliveryDate: deliverySelectionResponse.deliveryDate,
                      deliveryTime: deliverySelectionResponse.deliveryTime,
                  }
                : null,
        [deliverySelectionResponse],
    );

    const {data: summary, isLoading: isSummaryLoading} = useGetCheckoutSummaryQuery(
        {
            locale: i18n.language,
            currency,
            tipAmount: tip,
            couponCode: couponCode,
        },
        {
            skip: !isAuthenticated,
        },
    );

    const calculatedTotals = useMemo(
        () => (summary ? calculateCheckoutTotals(summary, tip) : null),
        [summary, tip],
    );

    const orderSummaryRows = useMemo(() => {
        if (!summary || !calculatedTotals) return [];

        return buildCheckoutSummaryRows(summary, tip, calculatedTotals.couponDiscount, {
            itemsTotal: t("summary.itemsTotal"),
            deliveryFee: t("summary.deliveryFee"),
            serviceFee: t("summary.serviceFee"),
            tip: t("summary.tip"),
            coupon: t("summary.coupon"),
        });
    }, [calculatedTotals, summary, t, tip]);

    return createControllerResult({
        data: {
            orderSummaryRows,
            totalAmount: calculatedTotals?.totalAmount ?? 0,
            summaryTitle: t("summary.title"),
            summaryTotalLabel: t("summary.total"),
            placeOrder: {
                summary,
                deliverySelection,
                tip,
                couponCode,
            },
        },
        status: {
            isSummaryLoading,
        },
    });
};
