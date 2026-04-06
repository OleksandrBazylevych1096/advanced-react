import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router";

import {
    ADDRESS_MODE_TITLES,
    saveShippingAddressActions,
    selectSaveShippingAddressMode,
} from "@/features/save-shipping-address";

import {selectIsAuthenticated} from "@/entities/user";

import {AppRoutes, routePaths} from "@/shared/config";
import {useLocalizedRoutePath} from "@/shared/lib/routing";
import {useAppDispatch, useAppSelector} from "@/shared/lib/state";

export const useManageShippingAddress = () => {
    const navigate = useNavigate();
    const getLocalizedPath = useLocalizedRoutePath();
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const mode = useAppSelector(selectSaveShippingAddressMode);
    const {t} = useTranslation();

    const openSignIn = () => {
        navigate(getLocalizedPath(routePaths[AppRoutes.LOGIN]));
    };

    const goBack = () => {
        dispatch(saveShippingAddressActions.returnToChoose());
    };

    const modalTitle = t(ADDRESS_MODE_TITLES[mode]);
    const shouldShowEditForm = mode === "add" || mode === "edit";

    return {
        data: {
            modalTitle,
            shouldShowEditForm,
            mode,
            isAuthenticated,
        },
        actions: {
            openSignIn,
            goBack,
        },
    };
};
