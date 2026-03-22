import type {FC, ReactNode, SVGProps} from "react";

import {cn} from "@/shared/lib/styling";
import {AppIcon} from "@/shared/ui/AppIcon";
import {Stack} from "@/shared/ui/Stack/Stack";
import {Typography} from "@/shared/ui/Typography/Typography";

import styles from "./StateViews.module.scss";

interface EmptyStateProps {
    icon?: FC<SVGProps<SVGSVGElement>>;
    title: string;
    description?: string;
    action?: ReactNode;
    className?: string;
    "data-testid"?: string;
}

export const EmptyState = ({
    icon,
    title,
    description,
    action,
    className,
    "data-testid": dataTestId = "empty-state",
}: EmptyStateProps) => {
    return (
        <Stack
            className={cn(styles.container, className)}
            gap={16}
            align="center"
            justify="center"
            data-testid={dataTestId}
        >
            {icon && <AppIcon Icon={icon} className={styles.icon} />}
            <Typography variant="heading" weight="semibold">
                {title}
            </Typography>
            {description && (
                <Typography className={styles.description} variant="body" tone="muted">
                    {description}
                </Typography>
            )}
            {action}
        </Stack>
    );
};
