import {useTranslation} from "react-i18next";

import {ChooseDeliveryDate} from "@/features/choose-delivery-date";

import {buildShippingAddressLabel, type BaseShippingAddress} from "@/entities/shipping-address";

import {Button} from "@/shared/ui/Button";
import {Stack} from "@/shared/ui/Stack";
import {Typography} from "@/shared/ui/Typography";

import pageStyles from "../CheckoutPage.module.scss";

import styles from "./CheckoutDeliveryInfoCard.module.scss";

interface CheckoutDeliveryInfoCardProps {
    address: BaseShippingAddress | undefined;
    onOpenManageShippingAddressModal: () => void;
}

export const CheckoutDeliveryInfoCard = ({
    address,
    onOpenManageShippingAddressModal,
}: CheckoutDeliveryInfoCardProps) => {
    const {t} = useTranslation("checkout");

    const fallbackMessage = t("checkoutMainSection.addressNotSpecified");
    const addressLabel = buildShippingAddressLabel(address, fallbackMessage);

    return (
        <Stack className={pageStyles.cardSurface} gap={12}>
            <Typography as="h3" variant="heading" weight="semibold">
                {t("checkoutMainSection.deliveryInfo")}
            </Typography>

            <Stack direction="row" align="center" gap={12}>
                <Typography tone="muted" variant="body" className={styles.metaLabel}>
                    {t("checkoutMainSection.deliverTo")}
                </Typography>
                <Stack direction="row" align="center" gap={8}>
                    <Button
                        theme="ghost"
                        size="sm"
                        className={styles.addressButton}
                        onClick={onOpenManageShippingAddressModal}
                        data-testid="checkout-delivery-address-trigger"
                    >
                        <Typography variant="body" weight="bold" className={styles.addressText}>
                            {addressLabel}
                        </Typography>
                    </Button>
                </Stack>
            </Stack>

            <Stack direction="row" align="center" gap={12}>
                <Typography tone="muted" variant="body" className={styles.metaLabel}>
                    {t("checkoutMainSection.deliveryDate")}
                </Typography>
                <ChooseDeliveryDate className={styles.deliveryDateTrigger} />
            </Stack>
        </Stack>
    );
};
