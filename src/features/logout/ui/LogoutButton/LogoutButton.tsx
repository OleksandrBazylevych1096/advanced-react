import {useTranslation} from "react-i18next";

import UsersIcon from "@/shared/assets/icons/Users.svg?react";
import {AppIcon, Button} from "@/shared/ui";

import {useLogoutController} from "../../model/controllers/useLogoutController";

export const LogoutButton = () => {
    const {t} = useTranslation();
    const {
        status: {isLoading},
        actions: {logout},
    } = useLogoutController();

    return (
        <Button theme="outline" onClick={logout} isLoading={isLoading}>
            <AppIcon Icon={UsersIcon} />
            <span>{t("header.logout")}</span>
        </Button>
    );
};
