import {useTranslation} from "react-i18next";

import PageErrorIcon from "@/shared/assets/icons/PageError.svg?react";
import {Button, Stack, Typography} from "@/shared/ui";

import styles from "./PageError.module.scss";

interface PageErrorProps {
    error?: string;
}

export const PageError = ({error}: PageErrorProps) => {
    const {t} = useTranslation();

    const reloadPage = () => {
        location.reload();
    };
    const description = error ?? t("pageError.description");

    return (
        <Stack className={styles.wrapper} align="center" justify="center">
            <Stack className={styles.content} gap={16}>
                <PageErrorIcon className={styles.icon} />
                <Typography as="h3" variant="display" tone="primary" weight="bold">
                    {t("pageError.title")}
                </Typography>
                <Typography
                    className={styles.description}
                    variant="body"
                    tone="muted"
                    weight="semibold"
                >
                    {description}
                </Typography>
                <Button
                    onClick={reloadPage}
                    theme="primary"
                    form="rounded"
                    className={styles.button}
                >
                    {t("pageError.reload")}
                </Button>
            </Stack>
        </Stack>
    );
};
