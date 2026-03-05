import type {MouseEvent} from "react";

import type {ShippingAddress} from "@/entities/shipping-address";

import {createControllerResult} from "@/shared/lib";

import {useSetDefaultShippingAddressMutation} from "../../api/selectDefaultShippingAddressApi";

export const useSelectDefaultShippingAddressController = () => {
    const [setDefault] = useSetDefaultShippingAddressMutation();

    const selectDefaultAddress = async (
        e: MouseEvent<HTMLDivElement>,
        address: ShippingAddress,
    ) => {
        e.stopPropagation();

        if (address.isDefault) return;

        await setDefault({id: address.id});
    };

    return createControllerResult({
        actions: {
            selectDefaultAddress,
        },
    });
};
