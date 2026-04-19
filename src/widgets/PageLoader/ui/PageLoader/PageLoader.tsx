import type {ReactElement} from "react";
import {useTranslation} from "react-i18next";

import {cn} from "@/shared/lib/styling";
import {Spinner} from "@/shared/ui/Spinner";
import {Stack} from "@/shared/ui/Stack";
import {Typography} from "@/shared/ui/Typography";

import styles from "./PageLoader.module.scss";

interface PageLoaderProps {
    fullscreen?: boolean;
}

export const PageLoader = (props: PageLoaderProps): ReactElement => {
    const {fullscreen = false} = props;
    const {t} = useTranslation();

    return (
        <Stack
            className={cn(styles.wrapper, {[styles.fullscreen]: fullscreen})}
            gap={16}
            align="center"
            justify="center"
        >
            <Typography as="h3" variant="heading" tone="default" weight="bold">
                {t("pageLoader.loading")}
            </Typography>
            <Spinner size="lg" />
        </Stack>
    );
};
