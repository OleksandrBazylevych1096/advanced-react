import styles from "@/entities/order/ui/OrderSummaryCard.module.scss";

import {cn} from "@/shared/lib";
import {Stack, Typography} from "@/shared/ui";

interface SummaryRowProps {
    label: string;
    value: string;
    emphasized?: boolean;
}

export const SummaryRow = ({label, value, emphasized = false}: SummaryRowProps) => {
    const weight = emphasized ? "bold" : "medium";
    const tone = emphasized ? "default" : "muted";
    const variant = emphasized ? "heading" : "body";

    return (
        <Stack
            direction="row"
            justify="space-between"
            align="center"
            className={cn(styles.row, {
                [styles.totalRow]: emphasized,
            })}
        >
            <Typography as="span" variant={variant} weight={weight} tone={tone}>
                {label}
            </Typography>
            <Typography as="span" variant={variant} weight={weight} tone={tone}>
                {value}
            </Typography>
        </Stack>
    );
};
