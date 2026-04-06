import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router";

import {selectApplyCouponCode} from "@/features/apply-coupon";
import {useGetDeliverySelectionQuery} from "@/features/choose-delivery-date";
import {selectChooseDeliveryTipAmount} from "@/features/choose-delivery-tip";

import {useGetDefaultShippingAddressQuery} from "@/entities/shipping-address";
import {selectIsAuthenticated, selectUserCurrency} from "@/entities/user";

import {AppRoutes, routePaths} from "@/shared/config";
import {useLocalizedRoutePath} from "@/shared/lib/routing";
import {useAppSelector} from "@/shared/lib/state";

import {useGetCheckoutSummaryQuery} from "../../../api/checkoutApi/checkoutApi.ts";

export const useCheckoutPage = () => {
    const {i18n} = useTranslation("checkout");
    const navigate = useNavigate();
    const getLocalizedPath = useLocalizedRoutePath();

    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const currency = useAppSelector(selectUserCurrency);
    const tip = useAppSelector(selectChooseDeliveryTipAmount);
    const couponCode = useAppSelector(selectApplyCouponCode);

    const {
        data: summary,
        isLoading: isSummaryLoading,
        isError: isSummaryError,
    } = useGetCheckoutSummaryQuery(
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

    const {data: defaultAddress, isLoading: isDefaultAddressLoading} =
        useGetDefaultShippingAddressQuery(undefined, {
            skip: !isAuthenticated,
        });

    const {data: deliverySelectionResponse, isLoading: isDeliverySelectionLoading} =
        useGetDeliverySelectionQuery({locale: i18n.language}, {skip: !isAuthenticated});

    const goToCartPage = () => {
        navigate(getLocalizedPath(routePaths[AppRoutes.CART]));
    };

    return {
        data: {
            summary,
            defaultAddress,
            deliverySelection: deliverySelectionResponse,
            tip,
            couponCode,
        },
        status: {
            isLoading: isSummaryLoading || isDefaultAddressLoading || isDeliverySelectionLoading,
            isError: isSummaryError,
        },
        actions: {
            goToCartPage,
        },
    };
};
