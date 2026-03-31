import {useTranslation} from "react-i18next";

import {getCreditCardMeta} from "@/entities/order";

import {AppIcon} from "@/shared/ui/AppIcon";
import {Stack} from "@/shared/ui/Stack";
import {Typography} from "@/shared/ui/Typography";

import styles from "../OrderPage.module.scss";

interface OrderPaymentInfoCardProps {
    brand?: string | null;
    last4?: string | null;
}

export const OrderPaymentInfoCard = ({brand, last4}: OrderPaymentInfoCardProps) => {
    const {t} = useTranslation("checkout");
    const creditCardMeta = getCreditCardMeta(brand);
    const hasPaymentCardData = Boolean(last4);
    const paymentCardLabel = hasPaymentCardData
        ? t("order.paymentCardMasked", {
              brand: creditCardMeta.name,
              last4: last4,
          })
        : t("order.notAvailable");

    return (
        <Stack className={styles.cardSurface} gap={8}>
            <Typography as="h3" variant="heading" weight="bold">
                {t("order.payWith")}
            </Typography>
            {hasPaymentCardData ? (
                <Stack direction="row" align="center" gap={8} className={styles.paymentCardRow}>
                    <AppIcon
                        filled
                        size={"auto"}
                        Icon={creditCardMeta.icon}
                        className={styles.paymentCardIcon}
                    />
                    <Typography variant="body">{paymentCardLabel}</Typography>
                </Stack>
            ) : (
                <Typography variant="body" tone="muted">
                    {paymentCardLabel}
                </Typography>
            )}
        </Stack>
    );
};
