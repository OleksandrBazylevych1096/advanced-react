import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router";

import {CartPreview} from "@/widgets/Cart";
import {SearchPanel} from "@/widgets/SearchPanel";

import {LogoutButton} from "@/features/logout";

import {selectIsAuthenticated} from "@/entities/user";

import LogoIcon from "@/shared/assets/icons/Logo.svg?react";
import SettingIcon from "@/shared/assets/icons/Setting.svg?react";
import UsersIcon from "@/shared/assets/icons/Users.svg?react";
import {AppRoutes, routePaths} from "@/shared/config";
import {useLocalizedRoutePath} from "@/shared/lib/routing";
import {useAppSelector} from "@/shared/lib/state";
import {AppIcon} from "@/shared/ui/AppIcon";
import {Box} from "@/shared/ui/Box";
import {Button} from "@/shared/ui/Button";
import {Container} from "@/shared/ui/Container";
import {Stack} from "@/shared/ui/Stack";
import {Typography} from "@/shared/ui/Typography";

import styles from "./AppHeader.module.scss";
import {LanguageSwitcher} from "./LanguageSwitcher/LanguageSwitcher";
import {ManageShippingAddressModal} from "./ManageShippingAddressModal/ManageShippingAddressModal";
import {ThemeSwitcher} from "./ThemeSwitcher/ThemeSwitcher";

export const AppHeader = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const getLocalizedPath = useLocalizedRoutePath();

    const openLogin = () => {
        navigate(getLocalizedPath(routePaths[AppRoutes.LOGIN]));
    };

    const openSettings = () => {
        navigate(getLocalizedPath(routePaths[AppRoutes.SETTINGS_ACCOUNT_DETAILS]));
    };

    return (
        <header className={styles.header}>
            <Container>
                <Box py={10}>
                    <Stack direction="row" align="center" gap={20}>
                        <Stack className={styles.section} direction="row" align="center" gap={20}>
                            <LogoIcon className={styles.logo}/>
                            <ManageShippingAddressModal />
                        </Stack>

                        <Stack className={styles.section} direction="row" align="center" gap={20}>
                            <SearchPanel/>
                        </Stack>
                        <Stack className={styles.section} direction="row" align="center" gap={20}>
                            <CartPreview/>

                            {isAuthenticated ? (
                                <>
                                    <Button
                                        onClick={openSettings}
                                        theme="ghost"
                                        aria-label={t("header.settings")}
                                    >
                                        <AppIcon className={styles.settings} Icon={SettingIcon}/>
                                    </Button>
                                    <LogoutButton/>
                                </>
                            ) : (
                                <Button onClick={openLogin} theme="outline">
                                    <AppIcon Icon={UsersIcon}/>
                                    <Typography as="span" weight="medium">
                                        {t("header.login")}
                                    </Typography>
                                </Button>
                            )}

                            <Stack direction="row" gap={8}>
                                <ThemeSwitcher/>
                                <LanguageSwitcher/>
                            </Stack>
                        </Stack>
                    </Stack>
                </Box>
            </Container>
        </header>
    );
};
