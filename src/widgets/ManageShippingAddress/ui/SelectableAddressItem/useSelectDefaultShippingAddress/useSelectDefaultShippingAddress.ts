import type {MouseEvent} from "react";

import type {ShippingAddress} from "@/entities/shipping-address";

import {useSetDefaultShippingAddressMutation} from "../../../api/selectDefaultShippingAddressApi.ts";

export const useSelectDefaultShippingAddress = () => {
    const [setDefault] = useSetDefaultShippingAddressMutation();

    const selectDefaultAddress = async (
        e: MouseEvent<HTMLDivElement>,
        address: ShippingAddress,
    ) => {
        e.stopPropagation();

        if (address.isDefault) return;

        await setDefault({id: address.id});
    };

    return {
        actions: {
            selectDefaultAddress,
        },
    };
};
