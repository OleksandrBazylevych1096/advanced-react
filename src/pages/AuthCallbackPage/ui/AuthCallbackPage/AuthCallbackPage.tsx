import {useTranslation} from "react-i18next";

import {PageError} from "@/widgets/PageError";
import {PageLoader} from "@/widgets/PageLoader";

import {useAuthCallbackPage} from "./useAuthCallbackPage/useAuthCallbackPage.ts";

const AuthCallbackPage = () => {
    const {t} = useTranslation();
    const {
        data: {errorParam, authError, requiresTwoFactor},
    } = useAuthCallbackPage();

    if (errorParam) {
        const errorMessage = t(`errors.${errorParam}`, {
            defaultValue: t("errors.GOOGLE_AUTH_FAILED"),
        });
        return <PageError error={errorMessage} />;
    }

    if (authError) {
        return <PageError error={authError} />;
    }

    if (requiresTwoFactor) {
        return <PageLoader />;
    }

    return <PageLoader />;
};

export default AuthCallbackPage;
