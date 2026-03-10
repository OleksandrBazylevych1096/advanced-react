import {Button} from "@/shared/ui";

interface ClearCartButtonProps {
    onClear: () => void;
    isLoading?: boolean;
    className?: string;
}

export const ClearCartButton = ({onClear, isLoading = false, className}: ClearCartButtonProps) => {
    return (
        <Button
            theme="ghost"
            size="sm"
            onClick={onClear}
            isLoading={isLoading}
            className={className}
        >
            Clear Cart
        </Button>
    );
};
