import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router";

import {
    ADDRESS_MODE_TITLES,
    saveShippingAddressActions,
    selectSaveShippingAddressMode,
} from "@/features/save-shipping-address";

import {useGetDefaultShippingAddressQuery} from "@/entities/shipping-address";
import {selectUserData} from "@/entities/user";

import {AppRoutes, routePaths} from "@/shared/config";
import {createControllerResult, useAppDispatch, useAppSelector} from "@/shared/lib";

export const useManageShippingAddressController = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const userData = useAppSelector(selectUserData);
    const mode = useAppSelector(selectSaveShippingAddressMode);
    const {t} = useTranslation();

    const {
        isLoading,
        currentData: defaultAddress,
        isError,
    } = useGetDefaultShippingAddressQuery(undefined, {
        skip: !userData,
    });

    const closeModal = () => {
        dispatch(saveShippingAddressActions.returnToChoose());
    };

    const openSignIn = () => {
        navigate(routePaths[AppRoutes.LOGIN]);
    };

    const goBack = () => {
        dispatch(saveShippingAddressActions.returnToChoose());
    };

    const modalTitle = t(ADDRESS_MODE_TITLES[mode]);
    const shouldShowEditForm = mode === "add" || mode === "edit";

    return createControllerResult({
        data: {
            defaultAddress,
            modalTitle,
            shouldShowEditForm,
            mode,
            userData,
        },
        status: {
            isLoading,
            isError,
        },
        actions: {
            openSignIn,
            closeModal,
            goBack,
        },
    });
};
