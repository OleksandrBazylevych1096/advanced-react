import {useTranslation} from "react-i18next";

import {Button} from "@/shared/ui/Button";
import {Input} from "@/shared/ui/Input";
import {Stack} from "@/shared/ui/Stack";
import {Typography} from "@/shared/ui/Typography";

import styles from "./SetupTwoFactorCard.module.scss";
import {useSetupTwoFactor} from "./useSetupTwoFactor/useSetupTwoFactor.ts";

export const SetupTwoFactorCard = () => {
    const {t} = useTranslation("auth");
    const {
        data: {isEnabled, setupData, code},
        status: {error, isLoading},
        actions: {startSetup, changeCode, enable},
    } = useSetupTwoFactor();

    const isCodeInvalid = code.length > 0 && code.length < 6;

    return (
        <Stack className={styles.container} gap={12}>
            <Typography as="h2" variant="heading" weight="semibold">
                {t("sessions.twoFactorTitle")}
            </Typography>

            {isEnabled ? (
                <Typography variant="bodySm" tone="success">
                    {t("sessions.twoFactorEnabled")}
                </Typography>
            ) : (
                <Typography variant="bodySm" tone="muted">
                    {t("sessions.twoFactorDisabled")}
                </Typography>
            )}

            {!isEnabled && !setupData && (
                <Button
                    type="button"
                    theme="outline"
                    isLoading={isLoading}
                    onClick={() => void startSetup()}
                >
                    {t("sessions.twoFactorStart")}
                </Button>
            )}

            {!isEnabled && setupData && (
                <>
                    <Typography variant="bodySm" tone="muted">
                        {t("sessions.twoFactorScanHint")}
                    </Typography>
                    <img
                        className={styles.qr}
                        src={setupData.qrCodeDataUrl}
                        alt={t("sessions.twoFactorQrAlt")}
                    />

                    <Typography variant="bodySm" tone="muted">
                        {t("sessions.twoFactorBackupHint")}
                    </Typography>
                    <Stack as="ol" className={styles.backupList} gap={4}>
                        {setupData.backupCodes.map((backupCode) => (
                            <li key={backupCode}>{backupCode}</li>
                        ))}
                    </Stack>

                    <Input
                        label={t("sessions.twoFactorCodeLabel")}
                        placeholder={t("sessions.twoFactorCodePlaceholder")}
                        inputMode="numeric"
                        value={code}
                        onChange={changeCode}
                        error={isCodeInvalid}
                    />
                    <Button
                        type="button"
                        isLoading={isLoading}
                        disabled={code.length !== 6}
                        onClick={() => void enable()}
                    >
                        {t("sessions.twoFactorEnable")}
                    </Button>
                </>
            )}

            {error && (
                <Typography variant="bodySm" tone="danger">
                    {error}
                </Typography>
            )}
        </Stack>
    );
};
