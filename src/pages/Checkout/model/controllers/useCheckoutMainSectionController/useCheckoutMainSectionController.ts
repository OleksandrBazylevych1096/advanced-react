import {useMemo} from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router";

import {selectApplyCouponCode} from "@/features/checkout/apply-coupon";
import {selectChooseDeliveryTipAmount} from "@/features/checkout/choose-delivery-tip";
import {useGetCheckoutSummaryQuery} from "@/features/checkout/place-order";
import {saveShippingAddressActions} from "@/features/shipping-address/save";

import {useGetDefaultShippingAddressQuery} from "@/entities/shipping-address";
import {selectIsAuthenticated, selectUserCurrency} from "@/entities/user";

import {AppRoutes, routePaths} from "@/shared/config";
import {useLocalizedRoutePath} from "@/shared/lib/routing";
import {createControllerResult, useAppDispatch, useAppSelector} from "@/shared/lib/state";

export const useCheckoutMainSectionController = () => {
    const {i18n} = useTranslation();
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const currency = useAppSelector(selectUserCurrency);
    const tip = useAppSelector(selectChooseDeliveryTipAmount);
    const couponCode = useAppSelector(selectApplyCouponCode);
    const navigate = useNavigate();
    const getLocalizedPath = useLocalizedRoutePath();

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

    const formattedAddress = useMemo(() => {
        if (!defaultAddress) return "";

        return [defaultAddress.streetAddress, defaultAddress.city, defaultAddress.zipCode]
            .filter(Boolean)
            .join(", ");
    }, [defaultAddress]);

    const openManageShippingAddressModal = () => {
        dispatch(saveShippingAddressActions.openManageShippingAddressModal());
    };

    const goToCartPage = () => {
        navigate(getLocalizedPath(routePaths[AppRoutes.CART]));
    };

    return createControllerResult({
        data: {
            summary,
            currency,
            formattedAddress,
        },
        status: {
            isLoading: isSummaryLoading || isDefaultAddressLoading,
            isSummaryError,
        },
        actions: {
            goToCartPage,
            openManageShippingAddressModal,
        },
    });
};
