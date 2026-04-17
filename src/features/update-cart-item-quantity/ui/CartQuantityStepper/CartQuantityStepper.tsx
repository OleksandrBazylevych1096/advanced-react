import {useUpdateCartItemQuantity} from "@/features/update-cart-item-quantity";

import {useToast} from "@/shared/lib/notifications";
import {Button} from "@/shared/ui/Button";
import {Stack} from "@/shared/ui/Stack";
import {Typography} from "@/shared/ui/Typography";

import styles from "./CartQuantityStepper.module.scss";

interface CartQuantityStepperProps {
    productId: string;
    quantity: number;
    maxQuantity: number;
    className?: string;
}

export const CartQuantityStepper = ({
    productId,
    quantity,
    maxQuantity,
    className,
}: CartQuantityStepperProps) => {
    const {error} = useToast();

    const {
        actions: {updateQuantity},
    } = useUpdateCartItemQuantity({
        onError: () => error("Failed to update cart"),
    });

    const decrementQuantity = () => {
        if (quantity > 1) {
            updateQuantity(productId, quantity - 1);
        }
    };

    const incrementQuantity = () => {
        if (quantity < maxQuantity) {
            updateQuantity(productId, quantity + 1);
        }
    };

    return (
        <Stack className={className} direction="row" align="center" gap={8}>
            <Button
                type="button"
                theme="primary"
                size="xs"
                form="circle"
                className={styles.quantityBtn}
                onClick={decrementQuantity}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
                data-testid={`cart-item-${productId}-decrease`}
            >
                -
            </Button>
            <Typography as="span" className={styles.quantity} variant="bodySm" weight="medium">
                {quantity}
            </Typography>
            <Button
                type="button"
                size="xs"
                theme="primary"
                form="circle"
                className={styles.quantityBtn}
                onClick={incrementQuantity}
                disabled={quantity >= maxQuantity}
                aria-label="Increase quantity"
                data-testid={`cart-item-${productId}-increase`}
            >
                +
            </Button>
        </Stack>
    );
};
