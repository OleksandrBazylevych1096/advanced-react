import {Button, Stack, Typography} from "@/shared/ui";

import styles from "./CartQuantityStepper.module.scss";

interface CartQuantityStepperProps {
    productId: string;
    quantity: number;
    maxQuantity: number;
    onQuantityChange: (productId: string, quantity: number) => void;
    className?: string;
}

export const CartQuantityStepper = ({
    productId,
    quantity,
    maxQuantity,
    onQuantityChange,
    className,
}: CartQuantityStepperProps) => {
    const decrementQuantity = () => {
        if (quantity > 1) {
            onQuantityChange(productId, quantity - 1);
        }
    };

    const incrementQuantity = () => {
        if (quantity < maxQuantity) {
            onQuantityChange(productId, quantity + 1);
        }
    };

    return (
        <Stack className={className} direction="row" align="center" gap={8}>
            <Button
                type="button"
                theme="tertiary"
                size="xs"
                form="circle"
                className={styles.quantityBtn}
                onClick={decrementQuantity}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
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
            >
                +
            </Button>
        </Stack>
    );
};
