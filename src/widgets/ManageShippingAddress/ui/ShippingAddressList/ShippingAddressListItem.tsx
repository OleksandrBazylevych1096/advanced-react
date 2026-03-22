import {DeleteConfirmationModal} from "@/features/shipping-address/delete";
import {InitializeEditModeButton} from "@/features/shipping-address/save";
import {SelectableAddressItem} from "@/features/shipping-address/select-default";

import type {ShippingAddress} from "@/entities/shipping-address";

import styles from "./ShippingAddressList.module.scss";

interface ShippingAddressListItemProps {
    address: ShippingAddress;
}

export const ShippingAddressListItem = (props: ShippingAddressListItemProps) => {
    const {address} = props;

    return (
        <SelectableAddressItem address={address}>
            <div className={styles.actions}>
                <InitializeEditModeButton address={address} />
                <DeleteConfirmationModal address={address} />
            </div>
        </SelectableAddressItem>
    );
};
