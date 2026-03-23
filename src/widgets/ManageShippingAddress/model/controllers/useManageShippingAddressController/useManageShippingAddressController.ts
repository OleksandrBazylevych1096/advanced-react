import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router";

import {
    ADDRESS_MODE_TITLES,
    saveShippingAddressActions,
    selectIsManageShippingAddressModalOpen,
    selectSaveShippingAddressMode,
} from "@/features/shipping-address/save";

import {useGetDefaultShippingAddressQuery} from "@/entities/shipping-address";
import {selectIsAuthenticated} from "@/entities/user";

import {AppRoutes, routePaths} from "@/shared/config";
import {useLocalizedRoutePath} from "@/shared/lib/routing";
import {createControllerResult, useAppDispatch, useAppSelector} from "@/shared/lib/state";

export const useManageShippingAddressController = () => {
    const navigate = useNavigate();
    const getLocalizedPath = useLocalizedRoutePath();
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const mode = useAppSelector(selectSaveShippingAddressMode);
    const isModalOpen = useAppSelector(selectIsManageShippingAddressModalOpen);
    const {t} = useTranslation();

    const {
        isLoading,
        currentData: defaultAddress,
        isError,
    } = useGetDefaultShippingAddressQuery(undefined, {
        skip: !isAuthenticated,
    });

    const closeModal = () => {
        dispatch(saveShippingAddressActions.returnToChoose());
        dispatch(saveShippingAddressActions.closeManageShippingAddressModal());
    };

    const openModal = () => {
        dispatch(saveShippingAddressActions.openManageShippingAddressModal());
    };

    const openSignIn = () => {
        navigate(getLocalizedPath(routePaths[AppRoutes.LOGIN]));
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
            isAuthenticated,
            isModalOpen,
        },
        status: {
            isLoading,
            isError,
        },
        actions: {
            openSignIn,
            openModal,
            closeModal,
            goBack,
        },
    });
};
