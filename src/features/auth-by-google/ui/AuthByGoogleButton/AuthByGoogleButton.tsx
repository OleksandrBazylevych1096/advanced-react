import {useTranslation} from "react-i18next";

import GoogleIcon from "@/shared/assets/icons/Google.svg?react";
import {cn} from "@/shared/lib";
import {AppIcon, Button} from "@/shared/ui";

import {callAuthByGoogle} from "../../lib/callAuthByGoogle/callAuthByGoogle";

interface AuthByGoogleButtonProps {
    className?: string;
}

export const AuthByGoogleButton = ({className}: AuthByGoogleButtonProps) => {
    const {t} = useTranslation("auth");
    return (
        <Button
            fullWidth
            size="md"
            theme="tertiary"
            onClick={callAuthByGoogle}
            className={cn(className)}
        >
            <AppIcon Icon={GoogleIcon} />
            {t("oauth.continueWith", {provider: "Google"})}
        </Button>
    );
};
