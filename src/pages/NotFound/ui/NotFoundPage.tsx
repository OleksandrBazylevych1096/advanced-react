import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import NotFoundIcon from "@/shared/assets/icons/NotFound.svg?react";
import { routePaths } from "@/shared/config";
import { Button } from "@/shared/ui";

import styles from "./NotFoundPage.module.scss";

const NotFoundPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleClickBack = () => {
    if (window.history.length < 1) {
      navigate(routePaths.home);
      return;
    }
    navigate(-1);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <NotFoundIcon className={styles.icon} />
        <h3 className={styles.title}>{t("notFound.title")}</h3>
        <p className={styles.description}>{t("notFound.description")}</p>
        <Button
          onClick={handleClickBack}
          theme="primary"
          form="rounded"
          className={styles.button}
        >
          {t("notFound.goBack")}
        </Button>
      </div>
    </div>
  );
};
export default NotFoundPage;
