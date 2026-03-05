import {useTranslation} from "react-i18next";
import {useLocation, useNavigate} from "react-router";

import {ManageShippingAddress} from "@/widgets/ManageShippingAddress";

import LogoIcon from "@/shared/assets/icons/Logo.svg?react";
import SearchIcon from "@/shared/assets/icons/Search.svg?react";
import UsersIcon from "@/shared/assets/icons/Users.svg?react";
import {AppRoutes, routePaths} from "@/shared/config";
import {useLocalizedRoutePath} from "@/shared/lib";
import {AppIcon, Box, Button, Container, Input, Stack} from "@/shared/ui";

import {useHeaderController} from "../model/controllers/useHeaderController";

import {CartPreview} from "./CartPreview/CartPreview";
import styles from "./Header.module.scss";
import {LanguageSwitcher} from "./LanguageSwitcher/LanguageSwitcher";
import {ThemeSwitcher} from "./ThemeSwitcher/ThemeSwitcher";

export const Header = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const {pathname} = useLocation();
    const getLocalizedPath = useLocalizedRoutePath();
    const {
        data: {user},
        actions: {logout},
    } = useHeaderController();

    const openLogin = () => {
        navigate(getLocalizedPath(routePaths[AppRoutes.LOGIN]));
    };

    if (pathname.endsWith(getLocalizedPath(routePaths[AppRoutes.LOGIN]))) return;

    return (
        <header className={styles.header}>
            <Container>
                <Box py={10}>
                    <Stack direction="row" align="center" gap={20}>
                        <Stack className={styles.section} direction="row" align="center" gap={20}>
                            <LogoIcon className={styles.logo}/>
                            <ManageShippingAddress/>
                        </Stack>

                        <Stack className={styles.section} direction="row" align="center" gap={20}>
                            <Input
                                fullWidth
                                placeholder={t("header.searchBy")}
                                Icon={<AppIcon size={18} Icon={SearchIcon} theme="background"/>}
                                rounded
                            />
                        </Stack>
                        <Stack className={styles.section} direction="row" align="center" gap={20}>
                            <CartPreview/>

                            {user?.id ? (
                                <Button onClick={logout} theme="outline">
                                    <AppIcon Icon={UsersIcon}/>
                                    <span>{t("header.logout")}</span>
                                </Button>
                            ) : (
                                <Button onClick={openLogin} theme="outline">
                                    <AppIcon Icon={UsersIcon}/>
                                    <span>{t("header.login")}</span>
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
