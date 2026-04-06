import {CartItems} from "@/widgets/Cart";

import {ChooseDeliveryDate} from "@/features/choose-delivery-date";

import {Stack} from "@/shared/ui/Stack";
import {Typography} from "@/shared/ui/Typography";

import {useClearCart} from "../../model/controllers/useClearCart";
import styles from "../CartPage/CartPage.module.scss";
import {ClearCartButton} from "../ClearCartButton/ClearCartButton";

interface CartPageItemsSectionProps {
    isCartReady?: boolean;
}

export const CartPageItemsSection = ({isCartReady = true}: CartPageItemsSectionProps) => {
    const {
        status: {isClearing},
        actions: {clearCart},
    } = useClearCart();

    return (
        <div className={styles.itemsSection}>
            {isCartReady && (
                <Stack gap={8} className={styles.deliveryDateSection}>
                    <Typography as="h3" variant="body" weight="semibold">
                        Delivery Date
                    </Typography>
                    <ChooseDeliveryDate className={styles.deliveryDateTrigger}/>
                </Stack>
            )}

            <div className={styles.itemsList}>
                <CartItems/>
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
