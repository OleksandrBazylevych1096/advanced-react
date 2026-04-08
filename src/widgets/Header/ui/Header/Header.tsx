import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router";

import {CartPreview} from "@/widgets/Header/ui/CartPreview/CartPreview.tsx";
import {LanguageSwitcher} from "@/widgets/Header/ui/LanguageSwitcher/LanguageSwitcher.tsx";
import {ManageShippingAddressModal} from "@/widgets/Header/ui/ManageShippingAddressModal/ManageShippingAddressModal.tsx";
import {ThemeSwitcher} from "@/widgets/Header/ui/ThemeSwitcher/ThemeSwitcher.tsx";
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

import styles from "./Header.module.scss";

export const Header = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const getLocalizedPath = useLocalizedRoutePath();

    const openLogin = () => {
        navigate(getLocalizedPath(routePaths[AppRoutes.LOGIN]));
    };

    const openSettings = () => {
        navigate(getLocalizedPath(routePaths[AppRoutes.SETTINGS_ORDERS]));
    };

    return (
        <header className={styles.header}>
            <Container>
                <Box py={10}>
                    <Stack direction="row" align="center" gap={20}>
                        <Stack className={styles.section} direction="row" align="center" gap={20}>
                            <LogoIcon className={styles.logo} />
                            <ManageShippingAddressModal />
                        </Stack>

                        <Stack className={styles.section} direction="row" align="center" gap={20}>
                            <SearchPanel />
                        </Stack>
                        <Stack className={styles.section} direction="row" align="center" gap={20}>
                            <CartPreview />

                            {isAuthenticated ? (
                                <>
                                    <Button
                                        className={styles.settings}
                                        onClick={openSettings}
                                        size={"lg"}
                                        theme="ghost"
                                        aria-label={t("Header.settings")}
                                    >
                                        <AppIcon Icon={SettingIcon} />
                                    </Button>
                                    <LogoutButton />
                                </>
                            ) : (
                                <Button onClick={openLogin} theme="outline">
                                    <AppIcon Icon={UsersIcon} />
                                    <Typography as="span" weight="medium">
                                        {t("Header.login")}
                                    </Typography>
                                </Button>
                            )}

                            <Stack direction="row" gap={8}>
                                <ThemeSwitcher />
                                <LanguageSwitcher />
                            </Stack>
                        </Stack>
                    </Stack>
                </Box>
            </Container>
        </header>
    );
};
