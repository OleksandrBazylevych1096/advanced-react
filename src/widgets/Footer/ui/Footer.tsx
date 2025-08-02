import { useTranslation } from "react-i18next";
import { Link } from "react-router";

import LogoIcon from "@/shared/assets/icons/Logo.svg?react";
import { routePaths } from "@/shared/config";

import styles from "./Footer.module.scss";

export const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <LogoIcon className={styles.icon} />

        <div className={styles.links}>
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>{t("footer.about")}</h3>
            <ul className={styles.linkList}>
              <li>
                <Link className={styles.link} to={routePaths.home}>
                  {t("footer.aboutUs")}
                </Link>
              </li>
              <li>
                <Link className={styles.link} to={routePaths.home}>
                  {t("footer.ourBranches")}
                </Link>
              </li>
              <li>
                <Link className={styles.link} to={routePaths.home}>
                  {t("footer.changeLog")}
                </Link>
              </li>
            </ul>
          </div>

          <div className={styles.column}>
            <h3 className={styles.columnTitle}>{t("footer.quickLinks")}</h3>
            <ul className={styles.linkList}>
              <li>
                <Link className={styles.link} to={routePaths.home}>
                  {t("footer.faqs")}
                </Link>
              </li>
              <li>
                <Link className={styles.link} to={routePaths.home}>
                  {t("footer.recipes")}
                </Link>
              </li>
              <li>
                <Link className={styles.link} to={routePaths.home}>
                  {t("footer.contactUs")}
                </Link>
              </li>
            </ul>
          </div>

          <div className={styles.column}>
            <h3 className={styles.columnTitle}>{t("footer.helpSupport")}</h3>
            <ul className={styles.linkList}>
              <li>
                <Link className={styles.link} to={routePaths.home}>
                  {t("footer.termsOfService")}
                </Link>
              </li>
              <li>
                <Link className={styles.link} to={routePaths.home}>
                  {t("footer.privacyPolicy")}
                </Link>
              </li>
              <li>
                <Link className={styles.link} to={routePaths.home}>
                  {t("footer.security")}
                </Link>
              </li>
            </ul>
          </div>
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>{t("footer.company")}</h3>
            <ul className={styles.linkList}>
              <li>
                <Link className={styles.link} to={routePaths.home}>
                  {t("footer.blog")}
                </Link>
              </li>
              <li>
                <Link className={styles.link} to={routePaths.home}>
                  {t("footer.contact")}
                </Link>
              </li>
            </ul>
          </div>
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>{t("footer.social")}</h3>
            <ul className={styles.linkList}>
              <li>
                <Link className={styles.link} to={routePaths.home}>
                  {t("footer.facebook")}
                </Link>
              </li>
              <li>
                <Link className={styles.link} to={routePaths.home}>
                  {t("footer.instagram")}
                </Link>
              </li>
              <li>
                <Link className={styles.link} to={routePaths.home}>
                  {t("footer.twitter")}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className={styles.copyright}>
        {t("footer.copyright", { year: "2024", company: "EmaStudio" })}
      </div>
    </footer>
  );
};
