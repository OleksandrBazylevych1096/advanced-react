import {useTranslation} from "react-i18next";

import UsersIcon from "@/shared/assets/icons/Users.svg?react";
import {AppIcon} from "@/shared/ui/AppIcon";
import {Button} from "@/shared/ui/Button";

import {useLogout} from "./useLogout/useLogout.ts";

export const LogoutButton = () => {
    const {t} = useTranslation();
    const {
        status: {isLoading},
        actions: {logout},
    } = useLogout();

    return (
        <Button theme="outline" onClick={logout} isLoading={isLoading}>
            <AppIcon Icon={UsersIcon} />
            <span>{t("header.logout")}</span>
        </Button>
    );
};
