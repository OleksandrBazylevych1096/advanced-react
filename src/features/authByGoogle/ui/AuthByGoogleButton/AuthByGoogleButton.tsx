import { useTranslation } from "react-i18next";

import GoogleIcon from "@/shared/assets/icons/Google.svg?react";
import { AppIcon, Button } from "@/shared/ui";

import { callAuthByGoogle } from "../../lib/callAuthByGoogle/callAuthByGoogle";

export const AuthByGoogleButton = () => {
  const { t } = useTranslation("auth");
  return (
    <Button fullWidth theme="secondary" onClick={callAuthByGoogle}>
      <AppIcon Icon={GoogleIcon} />
      {t("oauth.continueWith", { provider: "Google" })}
    </Button>
  );
};
