import {useTranslation} from "react-i18next";

import {type BaseShippingAddress, buildShippingAddressLabel} from "@/entities/shipping-address";

import {Stack} from "@/shared/ui/Stack";
import {Typography} from "@/shared/ui/Typography";

import styles from "../OrderPage/OrderPage.module.scss";

interface OrderDeliveryAddressCardProps {
    shippingAddress: BaseShippingAddress | undefined;
}

export const OrderDeliveryAddressCard = ({shippingAddress}: OrderDeliveryAddressCardProps) => {
    const {t} = useTranslation("checkout");

    const fallbackMessage = t("order.notAvailable");
    const label = buildShippingAddressLabel(shippingAddress, fallbackMessage);

    return (
        <Stack className={styles.cardSurface} gap={8}>
            <Typography as="h3" variant="heading" weight="bold">
                {t("order.deliveryAddress")}
            </Typography>
            <Typography variant="body" tone={shippingAddress ? "default" : "muted"}>
                {label}
            </Typography>
        </Stack>
    );
};
