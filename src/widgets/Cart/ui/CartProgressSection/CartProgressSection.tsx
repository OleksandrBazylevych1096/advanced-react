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
    const normalizedTarget = Math.max(target, 1);
    const progressPercent = Math.round((Math.min(value, normalizedTarget) / normalizedTarget) * 100);

    return (
        <Stack direction="column" gap={12} className={className}>

            <Typography className={textClassName} variant="body" weight="semibold">
                Cart value coverage: {progressPercent}% of {target}
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
