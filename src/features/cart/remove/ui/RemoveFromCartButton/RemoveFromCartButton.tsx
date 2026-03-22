import DeleteIcon from "@/shared/assets/icons/Delete.svg?react";
import {AppIcon} from "@/shared/ui/AppIcon";
import {Button} from "@/shared/ui/Button";

interface RemoveFromCartButtonProps {
    productId: string;
    onRemove: (productId: string) => void;
    className?: string;
    ariaLabel?: string;
}

export const RemoveFromCartButton = ({
    productId,
    onRemove,
    className,
    ariaLabel = "Remove item",
}: RemoveFromCartButtonProps) => {
    const removeItem = () => {
        onRemove(productId);
    };

    return (
        <Button
            theme="ghost"
            size="xs"
            onClick={removeItem}
            className={className}
            aria-label={ariaLabel}
        >
            <AppIcon Icon={DeleteIcon} size={16} />
        </Button>
    );
};
