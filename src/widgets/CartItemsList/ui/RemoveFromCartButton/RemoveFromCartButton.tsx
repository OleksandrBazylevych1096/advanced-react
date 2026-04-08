import {useRemoveFromCart} from "@/widgets/CartItemsList/ui/RemoveFromCartButton/useRemoveFromCart/useRemoveFromCart.ts";

import DeleteIcon from "@/shared/assets/icons/Delete.svg?react";
import {AppIcon} from "@/shared/ui/AppIcon";
import {Button} from "@/shared/ui/Button";

interface RemoveFromCartButtonProps {
    productId: string;
    className?: string;
    ariaLabel?: string;
}

export const RemoveFromCartButton = ({
    productId,
    className,
    ariaLabel = "Remove item",
}: RemoveFromCartButtonProps) => {
    const {
        actions: {removeItem},
    } = useRemoveFromCart();

    return (
        <Button
            theme="ghost"
            size="xs"
            onClick={() => removeItem(productId)}
            className={className}
            aria-label={ariaLabel}
        >
            <AppIcon Icon={DeleteIcon} size={16} />
        </Button>
    );
};
