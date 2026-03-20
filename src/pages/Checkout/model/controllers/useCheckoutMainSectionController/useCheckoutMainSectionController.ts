import {useMemo} from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router";

import {useGetCheckoutSummaryQuery} from "@/features/place-order";
import {saveShippingAddressActions} from "@/features/save-shipping-address";

import {useGetDefaultShippingAddressQuery} from "@/entities/shipping-address";
import {selectIsAuthenticated, selectUserCurrency} from "@/entities/user";

import {AppRoutes, routePaths} from "@/shared/config";
import {
    createControllerResult,
    useAppDispatch,
    useAppSelector,
    useLocalizedRoutePath,
} from "@/shared/lib";

export const useCheckoutMainSectionController = () => {
    const {i18n} = useTranslation();
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const currency = useAppSelector(selectUserCurrency);
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
