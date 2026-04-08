import {useTranslation} from "react-i18next";

import AddIcon from "@/shared/assets/icons/Add.svg?react";
import MapPinIcon from "@/shared/assets/icons/MapPinFilled.svg?react";
import {AppIcon} from "@/shared/ui/AppIcon";
import {Box} from "@/shared/ui/Box";
import {Button} from "@/shared/ui/Button";
import {Stack} from "@/shared/ui/Stack";
import {EmptyState, ErrorState} from "@/shared/ui/StateViews";

import {Loader} from "../Loader/Loader";

import styles from "./ShippingAddressList.module.scss";
import {ShippingAddressListItem} from "./ShippingAddressListItem";
import {useShippingAddressList} from "./useShippingAddressList/useShippingAddressList.ts";

export const ShippingAddressList = () => {
    const {t} = useTranslation();
    const {
        data: {addresses},
        status: {isLoading, isError},
        actions: {refetch, openAddAddress},
    } = useShippingAddressList();

    if (isLoading) return <Loader />;

    if (isError) {
        return (
            <Box>
                <ErrorState message={t("manageAddress.error.title")} onRetry={refetch} />
            </Box>
        );
    }

    if (!addresses || addresses.length === 0) {
        return (
            <Box>
                <Stack gap={16}>
                    <EmptyState
                        title={t("manageAddress.empty.title")}
                        description={t("manageAddress.empty.description")}
                        icon={MapPinIcon}
                    />
                    <Button onClick={openAddAddress} fullWidth data-testid="add-first-address-btn">
                        {t("manageAddress.addFirst")}
                    </Button>
                </Stack>
            </Box>
        );
    }

    return (
        <Box>
            <Stack gap={16}>
                <Box className={styles.body} data-testid="address-list">
                    <div className={styles.addressList}>
                        {addresses.map((address) => (
                            <ShippingAddressListItem key={address.id} address={address} />
                        ))}
                    </div>
                </Box>
                <Button
                    onClick={openAddAddress}
                    theme="ghost"
                    fullWidth
                    className={styles.addAddressButton}
                    data-testid="address-list-add-btn"
                >
                    <AppIcon Icon={AddIcon} filled />
                    {t("manageAddress.addNew")}
                </Button>
            </Stack>
        </Box>
    );
};
