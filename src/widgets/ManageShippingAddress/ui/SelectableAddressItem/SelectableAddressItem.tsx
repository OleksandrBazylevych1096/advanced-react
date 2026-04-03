import type {ReactNode} from "react";

import type {ShippingAddress} from "@/entities/shipping-address";

import {cn} from "@/shared/lib/styling";

import styles from "./SelectableAddressItem.module.scss";
import {useSelectDefaultShippingAddress} from "./useSelectDefaultShippingAddress/useSelectDefaultShippingAddress.ts";

interface SelectableAddressItemProps {
    address: ShippingAddress;
    children?: ReactNode;
}

export const SelectableAddressItem = (props: SelectableAddressItemProps) => {
    const {address, children} = props;
    const {
        actions: {selectDefaultAddress},
    } = useSelectDefaultShippingAddress();

    return (
        <div
            className={cn(styles.addressItem, {
                [styles.selected]: address.isDefault,
            })}
            onClick={(e) => selectDefaultAddress(e, address)}
            data-testid={`address-item-${address.id}`}
        >
            <div className={styles.addressInfo}>
                <div className={styles.radioContainer}>
                    <input
                        type="radio"
                        checked={address.isDefault}
                        readOnly
                        className={styles.radioButton}
                        data-testid={`address-item-${address.id}-radio`}
                    />
                </div>
                <div className={styles.addressDetails}>
                    <div className={styles.addressType}>{address.streetAddress}</div>
                    <div
                        className={styles.addressText}
                        data-testid={`address-item-${address.id}-street`}
                    >
                        {address.city}, {address.zipCode}
                    </div>
                </div>
            </div>
            {children}
        </div>
    );
};
