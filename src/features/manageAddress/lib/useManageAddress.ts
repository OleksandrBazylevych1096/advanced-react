import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router";

import {useGetDefaultShippingAddressQuery} from "@/features/manageAddress/api/manageAddressApi.ts";
import {ADDRESS_MODE_TITLES} from "@/features/manageAddress/consts/defaults.ts";
import {
    selectManageAddressMode
} from "@/features/manageAddress/model/selectors/selectManageAddressMode/selectManageAddressMode.tsx";
import {manageAddressActions} from "@/features/manageAddress/model/slice/addressSlice.ts";

import {selectUserData} from "@/entities/user";

import {routePaths} from "@/shared/config";
import {useAppDispatch, useAppSelector} from "@/shared/lib";

export const useManageAddress = () => {
    const navigator = useNavigate();
    const dispatch = useAppDispatch();
    const userData = useAppSelector(selectUserData);
    const mode = useAppSelector(selectManageAddressMode);
    const {t} = useTranslation();

    const {
        isLoading,
        currentData: defaultAddress,
        isError,
    } = useGetDefaultShippingAddressQuery(undefined, {
        skip: !userData,
    });

    const handleClose = () => {
        dispatch(manageAddressActions.returnToChoose());
    };

    const handleClickSignIn = () => {
        navigator(routePaths.login);
    };

    const handleGoBackClick = () => {
        dispatch(manageAddressActions.returnToChoose());
    };

    const modalTitle = t(ADDRESS_MODE_TITLES[mode]);
    const shouldShowEditForm = mode === "add" || mode === "edit";

    return {
        isLoading,
        defaultAddress,
        isError,
        handleClickSignIn,
        handleClose,
        handleGoBackClick,
        modalTitle,
        shouldShowEditForm,
        mode,
        userData
    }
}