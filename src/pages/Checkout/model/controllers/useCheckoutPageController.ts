import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router";

import {selectApplyCouponCode} from "@/features/checkout/apply-coupon";
import {useGetDeliverySelectionQuery} from "@/features/checkout/choose-delivery-date";
import {selectChooseDeliveryTipAmount} from "@/features/checkout/choose-delivery-tip";
import {useGetCheckoutSummaryQuery} from "@/features/checkout/place-order";
import {saveShippingAddressActions} from "@/features/shipping-address/save";

import {useGetDefaultShippingAddressQuery} from "@/entities/shipping-address";
import {selectIsAuthenticated, selectUserCurrency} from "@/entities/user";

import {AppRoutes, routePaths} from "@/shared/config";
import {useLocalizedRoutePath} from "@/shared/lib/routing";
import {createControllerResult, useAppDispatch, useAppSelector} from "@/shared/lib/state";

export const useCheckoutPageController = () => {
    const {i18n} = useTranslation("checkout");
    const dispatch = useAppDispatch();
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

    const openManageShippingAddressModal = () => {
        dispatch(saveShippingAddressActions.openManageShippingAddressModal());
    };

    const goToCartPage = () => {
        navigate(getLocalizedPath(routePaths[AppRoutes.CART]));
    };

    return createControllerResult({
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
            openManageShippingAddressModal,
        },
    });
};
