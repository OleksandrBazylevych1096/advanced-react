import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router";

import NotFoundIcon from "@/shared/assets/icons/NotFound.svg?react";
import {AppRoutes, routePaths} from "@/shared/config";
import {useLocalizedRoutePath} from "@/shared/lib/routing";
import {AppPage} from "@/shared/ui/AppPage";
import {Button} from "@/shared/ui/Button";
import {Stack} from "@/shared/ui/Stack";
import {Typography} from "@/shared/ui/Typography";

import styles from "./NotFoundPage.module.scss";

const NotFoundPage = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const getLocalizedPath = useLocalizedRoutePath();

    const goBack = () => {
        if (window.history.length < 1) {
            navigate(getLocalizedPath(routePaths[AppRoutes.HOME]));
            return;
        }
        navigate(-1);
    };

    return (
        <AppPage className={styles.wrapper} data-testid="not-found-page">
            <Stack className={styles.content} gap={16}>
                <NotFoundIcon className={styles.icon} />
                <Typography as="h3" variant="display" tone="primary" weight="bold">
                    {t("notFound.title")}
                </Typography>
                <Typography
                    className={styles.description}
                    variant="body"
                    tone="muted"
                    weight="semibold"
                >
                    {t("notFound.description")}
                </Typography>
                <Button onClick={goBack} theme="primary" form="rounded" className={styles.button}>
                    {t("notFound.goBack")}
                </Button>
            </Stack>
        </AppPage>
    );
};
export default NotFoundPage;
