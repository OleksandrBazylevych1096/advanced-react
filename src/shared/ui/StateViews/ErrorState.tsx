import {useTranslation} from "react-i18next";

import {cn} from "@/shared/lib/styling";
import {Button} from "@/shared/ui/Button";
import {Stack} from "@/shared/ui/Stack";
import {Typography} from "@/shared/ui/Typography";

import styles from "./StateViews.module.scss";

interface ErrorStateProps {
    message?: string;
    onRetry?: () => void;
    retryText?: string;
    className?: string;
    "data-testid"?: string;
}

export const ErrorState = ({
                               message,
                               onRetry,
                               retryText,
                               className,
                               "data-testid": datatestId = "error-state",
                           }: ErrorStateProps) => {
    const {t} = useTranslation();

    return (
        <Stack
            data-testid={datatestId}
            className={cn(styles.container, className)}
            gap={16}
            align="center"
            justify="center"
        >
            <Typography variant="heading" weight="semibold" tone="danger">
                {message || t("common.errorDefault")}
            </Typography>
            {onRetry && (
                <Button onClick={onRetry} theme="outline" size="sm">
                    {retryText || t("common.tryAgain")}
                </Button>
            )}
        </Stack>
    );
};
