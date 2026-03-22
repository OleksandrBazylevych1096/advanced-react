import MapPinIcon from "@/shared/assets/icons/MapPin.svg?react";
import {AppIcon} from "@/shared/ui/AppIcon";
import {Spinner} from "@/shared/ui/Spinner";
import {Stack} from "@/shared/ui/Stack";
import {Typography} from "@/shared/ui/Typography";

import styles from "./ManageShippingAddress.module.scss";

interface DisplayShippingAddressProps {
    isLoading: boolean;
    isError: boolean;
    streetAddress?: string;
}

export const DisplayShippingAddress = (props: DisplayShippingAddressProps) => {
    const {isLoading, streetAddress, isError} = props;

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

    if (isError || !streetAddress) {
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
                {streetAddress}
            </Typography>
        </Stack>
    );
};
