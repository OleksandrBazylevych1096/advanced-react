import {useTranslation} from "react-i18next";

import {Button} from "@/shared/ui/Button";
import {Stack} from "@/shared/ui/Stack";
import {Typography} from "@/shared/ui/Typography";

import {useUnlinkGoogleController} from "../../model/controllers/useUnlinkGoogleController";

export const UnlinkGoogleButton = () => {
    const {t} = useTranslation("auth");
    const {
        status: {isLoading, error, isSuccess},
        actions: {unlink},
    } = useUnlinkGoogleController();

    return (
        <Stack gap={8}>
            <Button
                type="button"
                theme="outline"
                isLoading={isLoading}
                onClick={() => void unlink()}
            >
                {t("sessions.unlinkGoogle")}
            </Button>
            {isSuccess && (
                <Typography variant="bodySm" tone="success" weight="semibold">
                    {t("sessions.unlinkGoogleSuccess")}
                </Typography>
            )}
            {error && (
                <Typography variant="bodySm" tone="danger" weight="semibold">
                    {error}
                </Typography>
            )}
        </Stack>
    );
};
