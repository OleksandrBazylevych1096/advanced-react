import {useGetDefaultShippingAddressQuery} from "@/entities/shipping-address";
import {selectIsAuthenticated} from "@/entities/user";

import MapPinIcon from "@/shared/assets/icons/MapPin.svg?react";
import {useAppSelector} from "@/shared/lib/state";
import {AppIcon} from "@/shared/ui/AppIcon";
import {Spinner} from "@/shared/ui/Spinner";
import {Stack} from "@/shared/ui/Stack";
import {Typography} from "@/shared/ui/Typography";

import styles from "../ManageShippingAddress/ManageShippingAddress.module.scss";

export const DisplayShippingAddress = () => {
    const isAuthenticated = useAppSelector(selectIsAuthenticated);

    const {
        isLoading,
        currentData: defaultAddress,
        isError,
    } = useGetDefaultShippingAddressQuery(undefined, {
        skip: !isAuthenticated,
    });

    if (isLoading) {
        return (
            <Stack direction="row" align="center" gap={8} data-testid="manage-address-loading">
                <Spinner size="sm" />
                <Typography as="span" variant="body">
                    Loading
                </Typography>
            </Stack>
        );
    }

    if (isError || !defaultAddress || !defaultAddress.streetAddress) {
        return (
            <Stack direction="row" align="center" gap={8}>
                <AppIcon Icon={MapPinIcon} className={styles.addressIcon} />
                <Typography
                    as="span"
                    variant="body"
                    className={styles.address}
                    data-testid="manage-address-fallback"
                >
                    Select your address
                </Typography>
            </Stack>
        );
    }

    return (
        <Stack direction="row" align="center" gap={8}>
            <AppIcon Icon={MapPinIcon} className={styles.addressIcon} />

            <Typography
                as="span"
                variant="body"
                className={styles.address}
                data-testid="manage-address-street"
            >
                {defaultAddress.streetAddress}
            </Typography>
        </Stack>
    );
};
