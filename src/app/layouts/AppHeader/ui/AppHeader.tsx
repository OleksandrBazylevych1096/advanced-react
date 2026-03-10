import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router";

import {CartPreview} from "@/widgets/Cart";
import {ManageShippingAddress} from "@/widgets/ManageShippingAddress";

import {LogoutButton} from "@/features/logout";

import {selectIsAuthenticated} from "@/entities/user";

import LogoIcon from "@/shared/assets/icons/Logo.svg?react";
import SearchIcon from "@/shared/assets/icons/Search.svg?react";
import UsersIcon from "@/shared/assets/icons/Users.svg?react";
import {AppRoutes, routePaths} from "@/shared/config";
import {useAppSelector, useLocalizedRoutePath} from "@/shared/lib";
import {AppIcon, Box, Button, Container, Input, Stack, Typography} from "@/shared/ui";

import styles from "./AppHeader.module.scss";
import {LanguageSwitcher} from "./LanguageSwitcher/LanguageSwitcher";
import {ThemeSwitcher} from "./ThemeSwitcher/ThemeSwitcher";

export const AppHeader = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const getLocalizedPath = useLocalizedRoutePath();

    const openLogin = () => {
        navigate(getLocalizedPath(routePaths[AppRoutes.LOGIN]));
    };

    return (
        <header className={styles.header}>
            <Container>
                <Box py={10}>
                    <Stack direction="row" align="center" gap={20}>
                        <Stack className={styles.section} direction="row" align="center" gap={20}>
                            <LogoIcon className={styles.logo} />
                            <ManageShippingAddress />
                        </Stack>

                        <Stack className={styles.section} direction="row" align="center" gap={20}>
                            <Input
                                fullWidth
                                placeholder={t("header.searchBy")}
                                Icon={<AppIcon size={18} Icon={SearchIcon} theme="background" />}
                                rounded
                            />
                        </Stack>
                        <Stack className={styles.section} direction="row" align="center" gap={20}>
                            <CartPreview />

                            {isAuthenticated ? (
                                <LogoutButton />
                            ) : (
                                <Button onClick={openLogin} theme="outline">
                                    <AppIcon Icon={UsersIcon} />
                                    <Typography as="span" weight="medium">{t("header.login")}</Typography>
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
