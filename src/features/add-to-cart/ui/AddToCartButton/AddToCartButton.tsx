import type {Product} from "@/entities/product";

import AddIcon from "@/shared/assets/icons/Add.svg?react";
import ShoppingCartIcon from "@/shared/assets/icons/ShoppingCart.svg?react";
import {AppIcon, Button} from "@/shared/ui";

import {useAddToCartController} from "../../model/controllers/useAddToCartController";

import styles from "./AddToCartButton.module.scss";

interface AddToCartButtonProps {
    product: Product;
    className?: string;
    compact?: boolean;
}

export const AddToCartButton = ({product, className, compact = false}: AddToCartButtonProps) => {
    const {
        data: {pendingCount, existingQuantity},
        actions: {addToCart},
    } = useAddToCartController(product);

    const isOutOfStock = product.stock <= 0;
    const totalInCart = existingQuantity + pendingCount;
    const isMaxReached = totalInCart >= product.stock;

    const disabled = isOutOfStock || isMaxReached;

    const addSingleItem = () => {
        if (disabled) return;
        addToCart(1);
    };

    const buttonText = isOutOfStock
        ? "Out of stock"
        : isMaxReached
          ? "Maximum in cart"
          : "Add to cart";

    if (compact) {
        return (
            <Button
                onClick={addSingleItem}
                disabled={disabled}
                form="circle"
                size="md"
                className={className}
            >
                {pendingCount > 0 ? (
                    <span className={styles.pendingText}>+{pendingCount}</span>
                ) : (
                    <AppIcon Icon={AddIcon} />
                )}
            </Button>
        );
    }

    return (
        <Button
            fullWidth
            size="lg"
            onClick={addSingleItem}
            disabled={disabled}
            className={className}
        >
            <AppIcon Icon={ShoppingCartIcon} size={16} />
            <span className={styles.text}>{buttonText}</span>

            {pendingCount > 0 && <span className={styles.pendingText}>(+{pendingCount})</span>}
        </Button>
    );
};
