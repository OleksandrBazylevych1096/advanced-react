import {DeleteConfirmationModal} from "@/features/delete-shipping-address";
import {InitializeEditModeButton} from "@/features/save-shipping-address";
import {SelectableAddressItem} from "@/features/select-default-shipping-address";

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
