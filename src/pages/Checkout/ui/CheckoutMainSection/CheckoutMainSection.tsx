import {useTranslation} from "react-i18next";

import {ReviewOrderItems} from "@/widgets/ReviewOrderItems";

import {ChooseDeliveryDate} from "@/features/checkout/choose-delivery-date";

import ArrowLeft from "@/shared/assets/icons/ArrowLeft.svg?react";
import {AppIcon} from "@/shared/ui/AppIcon";
import {Button} from "@/shared/ui/Button";
import {Stack} from "@/shared/ui/Stack";
import {Typography} from "@/shared/ui/Typography";

import {
    useCheckoutMainSectionController
} from "../../model/controllers/useCheckoutMainSectionController/useCheckoutMainSectionController";

import styles from "./CheckoutMainSection.module.scss";
import {CheckoutMainSectionSkeleton} from "./CheckoutMainSectionSkeleton";

export const CheckoutMainSection = () => {
    const {t} = useTranslation("checkout");

    const {
        data: {summary, formattedAddress},
        status: {isLoading, isSummaryError},
        actions: {openManageShippingAddressModal, goToCartPage},
    } = useCheckoutMainSectionController();

    if (isLoading) {
        return <CheckoutMainSectionSkeleton/>;
    }

    if (isSummaryError || !summary) {
        return (
            <Stack className={styles.column}>
                <Typography tone="danger">
                    {t("checkoutMainSection.failedToLoadSummary")}
                </Typography>
            </Stack>
        );
    }

    return (
        <Stack gap={40} className={styles.column}>
            <Stack direction="row" align="center" gap={12}>
                <Button
                    type="button"
                    theme="tertiary"
                    form="circle"
                    size="lg"
                    onClick={goToCartPage}
                    data-testid="checkout-go-back-trigger"
                >
                    <AppIcon Icon={ArrowLeft} size={18}/>
                </Button>
                <Typography as="h1" variant="display" weight="bold">
                    {t("checkoutTitle")}
                </Typography>
            </Stack>
            <Stack className={styles.card} gap={12}>
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
                            onClick={openManageShippingAddressModal}
                            data-testid="checkout-delivery-address-trigger"
                        >
                            <Typography variant="body" weight="bold" className={styles.addressText}>
                                {formattedAddress || t("checkoutMainSection.addressNotSpecified")}
                            </Typography>
                        </Button>
                    </Stack>
                </Stack>

                <Stack direction="row" align="center" gap={12}>
                    <Typography tone="muted" variant="body" className={styles.metaLabel}>
                        {t("checkoutMainSection.deliveryDate")}
                    </Typography>
                    <ChooseDeliveryDate className={styles.deliveryDateTrigger}/>
                </Stack>
            </Stack>

            <ReviewOrderItems items={summary.items}/>
        </Stack>
    );
};
