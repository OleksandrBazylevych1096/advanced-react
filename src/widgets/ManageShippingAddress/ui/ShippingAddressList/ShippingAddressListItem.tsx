import {InitializeEditModeButton} from "@/features/save-shipping-address";

import type {ShippingAddress} from "@/entities/shipping-address";

import {DeleteConfirmationModal} from "../DeleteConfirmationModal/DeleteConfirmationModal";
import {SelectableAddressItem} from "../SelectableAddressItem/SelectableAddressItem";

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
