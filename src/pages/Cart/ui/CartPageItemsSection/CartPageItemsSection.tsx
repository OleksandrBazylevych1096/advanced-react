import {CartItems} from "@/widgets/Cart";

import {ChooseDeliveryDate} from "@/features/choose-delivery-date";
import {ClearCartButton, useClearCartController} from "@/features/clear-cart";

import {Stack, Typography} from "@/shared/ui";

import styles from "../CartPage.module.scss";

interface CartPageItemsSectionProps {
    isCartReady?: boolean;
}

export const CartPageItemsSection = ({isCartReady = true}: CartPageItemsSectionProps) => {
    const {
        status: {isClearing},
        actions: {clearCart},
    } = useClearCartController();

    return (
        <div className={styles.itemsSection}>
            {isCartReady && (
                <Stack gap={8} className={styles.deliveryDateSection}>
                    <Typography as="h3" variant="body" weight="semibold">
                        Delivery Date
                    </Typography>
                    <ChooseDeliveryDate className={styles.deliveryDateTrigger} />
                </Stack>
            )}

            <div className={styles.itemsList}>
                <CartItems />
            </div>

            {isCartReady && (
                <div className={styles.itemsFooter}>
                    <ClearCartButton
                        onClear={clearCart}
                        isLoading={isClearing}
                        className={styles.clearBtn}
                    />
                </div>
            )}
        </div>
    );
};
