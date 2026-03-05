import type {MouseEvent} from "react";

import {saveShippingAddressActions} from "@/features/save-shipping-address";

import {useGetShippingAddressesQuery} from "@/entities/shipping-address";
import {selectUserData} from "@/entities/user";

import {createControllerResult, useAppDispatch, useAppSelector} from "@/shared/lib";

export const useShippingAddressListController = () => {
    const dispatch = useAppDispatch();
    const userData = useAppSelector(selectUserData);
    const query = useGetShippingAddressesQuery(undefined, {
        skip: !userData,
    });

    const openAddAddress = (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        dispatch(saveShippingAddressActions.initializeAddMode({}));
    };

    return createControllerResult({
        data: {
            addresses: query.data,
            userData,
        },
        status: {
            isLoading: query.isLoading,
            isFetching: query.isFetching,
            isError: query.isError,
            error: query.error,
        },
        actions: {
            openAddAddress,
            refetch: query.refetch,
        },
    });
};
