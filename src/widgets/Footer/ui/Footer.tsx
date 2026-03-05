import {useTranslation} from "react-i18next";
import {Link} from "react-router";

import LogoIcon from "@/shared/assets/icons/Logo.svg?react";
import {AppRoutes, routePaths} from "@/shared/config";
import {Box, Container, Stack, Typography} from "@/shared/ui";

import styles from "./Footer.module.scss";

export const Footer = () => {
    const {t} = useTranslation();

    return (
        <footer className={styles.footer}>
            <Container>
                <Box py={10}>
                    <Stack direction="row" gap={140} align="flex-start">
                        <LogoIcon className={styles.icon} />

                        <Stack className={styles.links} direction="row" gap={80}>
                            <Box className={styles.column}>
                                <Box mb={20}>
                                    <Typography
                                        as="h3"
                                        variant="heading"
                                        weight="bold"
                                        tone="default"
                                    >
                                        {t("footer.about")}
                                    </Typography>
                                </Box>
                                <ul className={styles.linkList}>
                                    <li>
                                        <Link className={styles.link} to={routePaths[AppRoutes.HOME]}>
                                            <Typography as="span" variant="bodySm" tone="muted">
                                                {t("footer.aboutUs")}
                                            </Typography>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className={styles.link} to={routePaths[AppRoutes.HOME]}>
                                            <Typography as="span" variant="bodySm" tone="muted">
                                                {t("footer.ourBranches")}
                                            </Typography>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className={styles.link} to={routePaths[AppRoutes.HOME]}>
                                            <Typography as="span" variant="bodySm" tone="muted">
                                                {t("footer.changeLog")}
                                            </Typography>
                                        </Link>
                                    </li>
                                </ul>
                            </Box>

                            <Box className={styles.column}>
                                <Box mb={20}>
                                    <Typography
                                        as="h3"
                                        variant="heading"
                                        weight="bold"
                                        tone="default"
                                    >
                                        {t("footer.quickLinks")}
                                    </Typography>
                                </Box>
                                <ul className={styles.linkList}>
                                    <li>
                                        <Link className={styles.link} to={routePaths[AppRoutes.HOME]}>
                                            <Typography as="span" variant="bodySm" tone="muted">
                                                {t("footer.faqs")}
                                            </Typography>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className={styles.link} to={routePaths[AppRoutes.HOME]}>
                                            <Typography as="span" variant="bodySm" tone="muted">
                                                {t("footer.recipes")}
                                            </Typography>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className={styles.link} to={routePaths[AppRoutes.HOME]}>
                                            <Typography as="span" variant="bodySm" tone="muted">
                                                {t("footer.contactUs")}
                                            </Typography>
                                        </Link>
                                    </li>
                                </ul>
                            </Box>

                            <Box className={styles.column}>
                                <Box mb={20}>
                                    <Typography
                                        as="h3"
                                        variant="heading"
                                        weight="bold"
                                        tone="default"
                                    >
                                        {t("footer.helpSupport")}
                                    </Typography>
                                </Box>
                                <ul className={styles.linkList}>
                                    <li>
                                        <Link className={styles.link} to={routePaths[AppRoutes.HOME]}>
                                            <Typography as="span" variant="bodySm" tone="muted">
                                                {t("footer.termsOfService")}
                                            </Typography>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className={styles.link} to={routePaths[AppRoutes.HOME]}>
                                            <Typography as="span" variant="bodySm" tone="muted">
                                                {t("footer.privacyPolicy")}
                                            </Typography>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className={styles.link} to={routePaths[AppRoutes.HOME]}>
                                            <Typography as="span" variant="bodySm" tone="muted">
                                                {t("footer.security")}
                                            </Typography>
                                        </Link>
                                    </li>
                                </ul>
                            </Box>

                            <Box className={styles.column}>
                                <Box mb={20}>
                                    <Typography
                                        as="h3"
                                        variant="heading"
                                        weight="bold"
                                        tone="default"
                                    >
                                        {t("footer.company")}
                                    </Typography>
                                </Box>
                                <ul className={styles.linkList}>
                                    <li>
                                        <Link className={styles.link} to={routePaths[AppRoutes.HOME]}>
                                            <Typography as="span" variant="bodySm" tone="muted">
                                                {t("footer.blog")}
                                            </Typography>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className={styles.link} to={routePaths[AppRoutes.HOME]}>
                                            <Typography as="span" variant="bodySm" tone="muted">
                                                {t("footer.contact")}
                                            </Typography>
                                        </Link>
                                    </li>
                                </ul>
                            </Box>

                            <Box className={styles.column}>
                                <Box mb={20}>
                                    <Typography
                                        as="h3"
                                        variant="heading"
                                        weight="bold"
                                        tone="default"
                                    >
                                        {t("footer.social")}
                                    </Typography>
                                </Box>
                                <ul className={styles.linkList}>
                                    <li>
                                        <Link className={styles.link} to={routePaths[AppRoutes.HOME]}>
                                            <Typography as="span" variant="bodySm" tone="muted">
                                                {t("footer.facebook")}
                                            </Typography>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className={styles.link} to={routePaths[AppRoutes.HOME]}>
                                            <Typography as="span" variant="bodySm" tone="muted">
                                                {t("footer.instagram")}
                                            </Typography>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className={styles.link} to={routePaths[AppRoutes.HOME]}>
                                            <Typography as="span" variant="bodySm" tone="muted">
                                                {t("footer.twitter")}
                                            </Typography>
                                        </Link>
                                    </li>
                                </ul>
                            </Box>
                        </Stack>
                    </Stack>
                </Box>
            </Container>

            <Box mt={32}>
                <Typography className={styles.copyright} variant="bodySm" tone="muted">
                    {t("footer.copyright", {year: "2024", company: "EmaStudio"})}
                </Typography>
            </Box>
        </footer>
    );
};
