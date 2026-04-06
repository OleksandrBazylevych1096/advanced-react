import {useTranslation} from "react-i18next";

import {Button} from "@/shared/ui/Button";
import {Grid} from "@/shared/ui/Grid";
import {Spinner} from "@/shared/ui/Spinner";
import {Stack} from "@/shared/ui/Stack";
import {EmptyState, ErrorState} from "@/shared/ui/StateViews";
import {Typography} from "@/shared/ui/Typography";

import styles from "./ManageSessions.module.scss";
import {useManageSessions} from "./useManageSessions/useManageSessions.ts";

const resolveBrowser = (userAgent?: string) => {
    if (!userAgent) return null;

    if (userAgent.includes("Edg/")) return "Microsoft Edge";
    if (userAgent.includes("OPR/")) return "Opera";
    if (userAgent.includes("Chrome/")) return "Google Chrome";
    if (userAgent.includes("Firefox/")) return "Mozilla Firefox";
    if (userAgent.includes("Safari/")) return "Safari";

    return null;
};

const resolveOperatingSystem = (userAgent?: string) => {
    if (!userAgent) return null;

    if (userAgent.includes("Windows NT")) return "Windows";
    if (userAgent.includes("Android")) return "Android";
    if (userAgent.includes("iPhone") || userAgent.includes("iPad")) return "iOS";
    if (userAgent.includes("Mac OS X")) return "macOS";
    if (userAgent.includes("Linux")) return "Linux";

    return null;
};

const resolveDeviceTypeKey = (userAgent?: string) => {
    if (!userAgent) return "settings.pages.security.unknown";

    if (/ipad|tablet/i.test(userAgent)) return "settings.pages.security.deviceTablet";
    if (/mobi|iphone|android/i.test(userAgent)) return "settings.pages.security.deviceMobile";

    return "settings.pages.security.deviceDesktop";
};

const formatSessionDate = (isoDate: string | undefined, locale: string) => {
    if (!isoDate) return null;

    const parsedDate = new Date(isoDate);
    if (Number.isNaN(parsedDate.getTime())) {
        return isoDate;
    }

    return new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    }).format(parsedDate);
};

export const ManageSessions = () => {
    const {t, i18n} = useTranslation();
    const {
        data: {sessions},
        status: {isLoading, error, isFetching},
        actions: {retry, revokeAll, revokeOne},
    } = useManageSessions();

    if (isLoading && sessions.length === 0) {
        return <Spinner size="lg" />;
    }

    if (error && sessions.length === 0) {
        return <ErrorState message={error} onRetry={() => void retry()} />;
    }

    if (sessions.length === 0) {
        return <EmptyState title={t("settings.pages.security.noActiveSessions")} />;
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
                    {t("settings.pages.security.revokeOther")}
                </Button>
                <Button type="button" theme="secondary" onClick={() => void revokeAll(true)}>
                    {t("settings.pages.security.revokeAll")}
                </Button>
                {isFetching && (
                    <Typography as="span" variant="bodySm" tone="muted">
                        {t("settings.pages.security.refreshing")}
                    </Typography>
                )}
            </Stack>
            <Grid as="ul" className={styles.list} gap={12}>
                {sessions.map((session) => (
                    <Grid as="li" key={session.id} className={styles.item} gap={10}>
                        <Stack className={styles.header} direction="row" justify="space-between" align="center">
                            <Stack gap={4}>
                                <Typography as="span" variant="bodySm" weight="bold">
                                    {session.isCurrent
                                        ? t("settings.pages.security.currentSession")
                                        : t("settings.pages.security.session")}
                                </Typography>
                                {session.isCurrent && (
                                    <Typography as="span" variant="caption" tone="muted">
                                        {t("settings.pages.security.thisDevice")}
                                    </Typography>
                                )}
                            </Stack>
                            <Button
                                type="button"
                                theme="ghost"
                                onClick={() => void revokeOne(session.id, session.isCurrent)}
                            >
                                {t("settings.pages.security.revoke")}
                            </Button>
                        </Stack>

                        <Grid className={styles.meta} cols={2} gap={10}>
                            <div className={styles.metaItem}>
                                <Typography as="span" variant="caption" tone="muted">
                                    {t("settings.pages.security.browserLabel")}
                                </Typography>
                                <Typography as="span" variant="bodySm" weight="medium">
                                    {resolveBrowser(session.userAgent) ?? t("settings.pages.security.unknown")}
                                </Typography>
                            </div>
                            <div className={styles.metaItem}>
                                <Typography as="span" variant="caption" tone="muted">
                                    {t("settings.pages.security.osLabel")}
                                </Typography>
                                <Typography as="span" variant="bodySm" weight="medium">
                                    {resolveOperatingSystem(session.userAgent) ??
                                        t("settings.pages.security.unknown")}
                                </Typography>
                            </div>
                            <div className={styles.metaItem}>
                                <Typography as="span" variant="caption" tone="muted">
                                    {t("settings.pages.security.deviceLabel")}
                                </Typography>
                                <Typography as="span" variant="bodySm" weight="medium">
                                    {t(resolveDeviceTypeKey(session.userAgent))}
                                </Typography>
                            </div>
                            <div className={styles.metaItem}>
                                <Typography as="span" variant="caption" tone="muted">
                                    {t("settings.pages.security.ipLabel")}
                                </Typography>
                                <Typography as="span" variant="bodySm" weight="medium">
                                    {session.ip ?? t("settings.pages.security.unknownIp")}
                                </Typography>
                            </div>
                        </Grid>

                        <div className={styles.lastActivity}>
                            <Typography as="span" variant="caption" tone="muted">
                                {t("settings.pages.security.lastActivity")}
                            </Typography>
                            <Typography as="span" variant="bodySm" weight="medium">
                                {formatSessionDate(
                                    session.lastActivity ?? session.updatedAt,
                                    i18n.resolvedLanguage ?? i18n.language,
                                ) ?? t("settings.pages.security.unknown")}
                            </Typography>
                        </div>
                    </Grid>
                ))}
            </Grid>
        </Stack>
    );
};
