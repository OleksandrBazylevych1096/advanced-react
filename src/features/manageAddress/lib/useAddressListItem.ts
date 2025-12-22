import type {MouseEvent} from "react";

import {useSetDefaultShippingAddressMutation} from "@/features/manageAddress/api/manageAddressApi.ts";
import {manageAddressActions} from "@/features/manageAddress/model/slice/addressSlice.ts";
import type {ShippingAddress} from "@/features/manageAddress/model/types/Address.ts";

import {useAppDispatch} from "@/shared/lib";

export const useAddressListItem = () => {
    const dispatch = useAppDispatch();

    const [setDefault] = useSetDefaultShippingAddressMutation();

    const handleAddressSelect = (address: ShippingAddress) => {
        if (address.isDefault) return;

        setDefault({id: address.id});
    };

    const handleClickEdit = (
        e: MouseEvent<HTMLButtonElement>,
        address: ShippingAddress
    ) => {
        e.stopPropagation();

        dispatch(
            manageAddressActions.initializeEditMode({
                id: address.id,
                form: {
                    city: address.city,
                    numberOfApartment: address.numberOfApartment,
                    streetAddress: address.streetAddress,
                    zipCode: address.zipCode,
                },
                location: [address.latitude, address.longitude],
            })
        );
    };

    return {
        handleAddressSelect,
        handleClickEdit
    }
}