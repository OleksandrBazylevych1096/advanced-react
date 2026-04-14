import {useTranslation} from "react-i18next";

import {CartItemsList} from "@/widgets/CartItemsList";

import {ChooseDeliveryDate} from "@/features/choose-delivery-date";

import {Stack} from "@/shared/ui/Stack";
import {Typography} from "@/shared/ui/Typography";

import styles from "../CartPage/CartPage.module.scss";
import {ClearCartButton} from "../ClearCartButton/ClearCartButton";

interface CartPageItemsSectionProps {
    isCartReady?: boolean;
}

export const CartPageItemsSection = ({isCartReady = true}: CartPageItemsSectionProps) => {
    const {t} = useTranslation();

    return (
        <div className={styles.itemsSection}>
            {isCartReady && (
                <Stack gap={8} className={styles.deliveryDateSection}>
                    <Typography as="h3" variant="body" weight="semibold">
                        {t("cart.deliveryDate")}
                    </Typography>
                    <ChooseDeliveryDate className={styles.deliveryDateTrigger} />
                </Stack>
            )}

            <div className={styles.itemsList}>
                <CartItemsList />
            </div>

            {isCartReady && (
                <div className={styles.itemsFooter}>
                    <ClearCartButton />
                </div>
            )}
        </div>
    );
};
