import type {MouseEvent} from "react";
import {useCallback} from "react";

import type {ShippingAddress} from "@/entities/shipping-address";

import {createControllerResult, useAppDispatch} from "@/shared/lib/state";

import {saveShippingAddressActions} from "../../slice/saveShippingAddressSlice";

export const useInitializeEditModeButtonController = (address: ShippingAddress) => {
    const dispatch = useAppDispatch();

    const startEdit = useCallback(
        (e: MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            dispatch(
                saveShippingAddressActions.initializeEditMode({
                    id: address.id,
                    form: {
                        streetAddress: address.streetAddress,
                        city: address.city,
                        numberOfApartment: address.numberOfApartment,
                        zipCode: address.zipCode,
                    },
                    location: [address.latitude, address.longitude],
                }),
            );
        },
        [address, dispatch],
    );

    return createControllerResult({
        actions: {startEdit},
    });
};
