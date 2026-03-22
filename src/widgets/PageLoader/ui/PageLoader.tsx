import {useTranslation} from "react-i18next";

import {Spinner} from "@/shared/ui/Spinner";
import {Stack} from "@/shared/ui/Stack";
import {Typography} from "@/shared/ui/Typography";

import styles from "./PageLoader.module.scss";

export const PageLoader = () => {
    const {t} = useTranslation();

    return (
        <Stack className={styles.wrapper} gap={16} align="center" justify="center">
            <Typography as="h3" variant="heading" tone="default" weight="bold">
                {t("pageLoader.loading")}
            </Typography>
            <Spinner size="lg" />
        </Stack>
    );
};
