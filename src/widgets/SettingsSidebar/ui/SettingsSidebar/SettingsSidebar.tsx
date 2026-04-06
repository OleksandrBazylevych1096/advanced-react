import {useTranslation} from "react-i18next";
import {NavLink} from "react-router";

import {AppRoutes, routePaths} from "@/shared/config";
import {useLocalizedRoutePath} from "@/shared/lib/routing";
import {cn} from "@/shared/lib/styling";
import {Stack} from "@/shared/ui/Stack";
import {Typography} from "@/shared/ui/Typography";

import styles from "./SettingsSidebar.module.scss";

const settingsMenuConfig = [
    {
        route: AppRoutes.SETTINGS_ACCOUNT_DETAILS,
        labelKey: "settings.menu.accountDetails",
    },
    {
        route: AppRoutes.SETTINGS_ORDERS,
        labelKey: "settings.menu.orders",
    },
    {
        route: AppRoutes.SETTINGS_SECURITY,
        labelKey: "settings.menu.security",
    },
    {
        route: AppRoutes.SETTINGS_ADDRESS,
        labelKey: "settings.menu.address",
    },
    {
        route: AppRoutes.SETTINGS_NOTIFICATIONS,
        labelKey: "settings.menu.notifications",
    },
] as const;

export const SettingsSidebar = () => {
    const {t} = useTranslation();
    const getLocalizedPath = useLocalizedRoutePath();

    return (
        <Stack as="aside" gap={4} className={styles.sidebar}>
            {settingsMenuConfig.map((item) => (
                <NavLink
                    key={item.route}
                    to={getLocalizedPath(routePaths[item.route])}
                    className={({isActive}) => cn(styles.link, {[styles.linkActive]: isActive})}
                >
                    <Typography as="span" weight="medium" className={styles.linkText}>
                        {t(item.labelKey)}
                    </Typography>
                </NavLink>
            ))}
            
        </Stack>
    );
};
