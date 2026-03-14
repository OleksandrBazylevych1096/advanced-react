import {useTranslation} from "react-i18next";

import {selectUserCurrency} from "@/entities/user";

import {formatCurrency, useAppSelector} from "@/shared/lib";
import {Progress, Stack, Typography} from "@/shared/ui";

interface CartProgressSectionProps {
    value: number;
    target: number;
    ariaLabel: string;
    className?: string;
    textClassName?: string;
    trackClassName?: string;
    fillClassName?: string;
}

export const CartProgressSection = ({
    value,
    target,
    ariaLabel,
    className,
    textClassName,
    trackClassName,
    fillClassName,
}: CartProgressSectionProps) => {
    const currency = useAppSelector(selectUserCurrency);
    const {i18n} = useTranslation();

    if (target <= 0) return null;

    const fullfilled = value >= target;

    return (
        <Stack direction="column" gap={12} className={className}>
            <Typography className={textClassName} variant="body" weight="semibold">
                {fullfilled
                    ? "Free delivery"
                    : `Get free delivery (${formatCurrency(currency, i18n.language, target - value)} more)`}
            </Typography>
            <Progress
                value={value}
                max={target}
                trackClassName={trackClassName}
                fillClassName={fillClassName}
                ariaLabel={ariaLabel}
            />
        </Stack>
    );
};
