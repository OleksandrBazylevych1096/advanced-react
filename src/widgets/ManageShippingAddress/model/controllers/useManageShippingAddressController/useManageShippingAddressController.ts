import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router";

import {
    ADDRESS_MODE_TITLES,
    saveShippingAddressActions,
    selectIsManageShippingAddressModalOpen,
    selectSaveShippingAddressMode,
} from "@/features/save-shipping-address";

import {useGetDefaultShippingAddressQuery} from "@/entities/shipping-address";
import {selectUserData} from "@/entities/user";

import {AppRoutes, routePaths} from "@/shared/config";
import {
    createControllerResult,
    useAppDispatch,
    useAppSelector,
    useLocalizedRoutePath,
} from "@/shared/lib";

export const useManageShippingAddressController = () => {
    const navigate = useNavigate();
    const getLocalizedPath = useLocalizedRoutePath();
    const dispatch = useAppDispatch();
    const userData = useAppSelector(selectUserData);
    const mode = useAppSelector(selectSaveShippingAddressMode);
    const isModalOpen = useAppSelector(selectIsManageShippingAddressModalOpen);
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
            userData,
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
