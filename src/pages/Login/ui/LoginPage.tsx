import {useTranslation} from "react-i18next";
import {Link} from "react-router";

import {AuthByGoogleButton} from "@/features/authByGoogle";
import {LoginForm, loginReducer} from "@/features/login";

import {routePaths} from "@/shared/config";
import {DynamicModuleLoader} from "@/shared/lib";
import {AppPage} from "@/shared/ui";

import styles from "./LoginPage.module.scss";

const LoginPage = () => {
    const {t} = useTranslation("auth");

    return (
        <AppPage className={styles.wrapper}>
            <div className={styles.main}>
                <h1 className={styles.title}>{t("login.signIn")}</h1>
                <DynamicModuleLoader
                    reducers={{loginForm: loginReducer}}
                    removeAfterUnmount
                >
                    <LoginForm/>
                </DynamicModuleLoader>
                <div className={styles.divider}>
                    <div className={styles.line}/>
                    <span className={styles.dividerText}>{t("or")}</span>
                    <div className={styles.line}/>
                </div>
                <div className={styles.authServices}>
                    <AuthByGoogleButton/>
                </div>
                <span className={styles.footer}>
          {t("login.dontHaveAccount")}{" "}
                    <Link className={styles.link} to={routePaths.register}>
            {t("register.signUp")}
          </Link>
        </span>
            </div>
        </AppPage>);
};

export default LoginPage;
