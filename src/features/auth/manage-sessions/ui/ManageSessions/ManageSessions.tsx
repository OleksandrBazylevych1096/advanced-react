import {useTranslation} from "react-i18next";

import {Button} from "@/shared/ui/Button";
import {Grid} from "@/shared/ui/Grid";
import {Spinner} from "@/shared/ui/Spinner";
import {Stack} from "@/shared/ui/Stack";
import {EmptyState, ErrorState} from "@/shared/ui/StateViews";
import {Typography} from "@/shared/ui/Typography";

import {useManageSessionsController} from "../../model/controllers/useManageSessionsController";

import styles from "./ManageSessions.module.scss";

export const ManageSessions = () => {
    const {t} = useTranslation("auth");
    const {
        data: {sessions},
        status: {isLoading, error, isFetching},
        actions: {retry, revokeAll, revokeOne},
    } = useManageSessionsController();

    if (isLoading && sessions.length === 0) {
        return <Spinner size="lg" />;
    }

    if (error && sessions.length === 0) {
        return <ErrorState message={error} onRetry={() => void retry()} />;
    }

    if (sessions.length === 0) {
        return <EmptyState title={t("sessions.noActiveSessions")} />;
    }

    return (
        <Stack gap={12}>
            {error && (
                <Typography variant="bodySm" tone="danger" weight="semibold">
                    {error}
                </Typography>
            )}
            <Stack className={styles.toolbar} direction="row" gap={8} align="center" wrap="wrap">
                <Button type="button" theme="outline" onClick={() => void revokeAll(false)}>
                    {t("sessions.revokeOther")}
                </Button>
                <Button type="button" theme="secondary" onClick={() => void revokeAll(true)}>
                    {t("sessions.revokeAll")}
                </Button>
                {isFetching && (
                    <Typography as="span" variant="bodySm" tone="muted">
                        {t("sessions.refreshing")}
                    </Typography>
                )}
            </Stack>
            <Grid as="ul" className={styles.list} gap={12}>
                {sessions.map((session) => (
                    <Grid as="li" key={session.id} className={styles.item} gap={6}>
                        <div className={styles.itemTitle}>
                            <Typography as="span" variant="bodySm" weight="bold">
                                {session.isCurrent
                                    ? t("sessions.currentSession")
                                    : t("sessions.session")}
                            </Typography>
                        </div>
                        <div>{session.userAgent ?? t("sessions.unknownDevice")}</div>
                        <div>{session.ip ?? t("sessions.unknownIp")}</div>
                        <div>
                            {t("sessions.lastActivity")}:{" "}
                            {session.lastActivity ?? session.updatedAt}
                        </div>
                        <Button
                            type="button"
                            theme="ghost"
                            onClick={() => void revokeOne(session.id, session.isCurrent)}
                        >
                            {t("sessions.revoke")}
                        </Button>
                    </Grid>
                ))}
            </Grid>
        </Stack>
    );
};
