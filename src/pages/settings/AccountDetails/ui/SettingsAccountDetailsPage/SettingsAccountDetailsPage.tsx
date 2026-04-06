import {useTranslation} from "react-i18next";

import {Box} from "@/shared/ui/Box";
import {Stack} from "@/shared/ui/Stack";
import {Typography} from "@/shared/ui/Typography";

const SettingsAccountDetailsPage = () => {
    const {t} = useTranslation();

    return (
        <Stack gap={16}>
            <Typography as="h2" variant="heading" weight="semibold">
                {t("settings.pages.accountDetails.title")}
            </Typography>
            <Box>
                <Typography tone="muted">{t("settings.pages.placeholder")}</Typography>
            </Box>
        </Stack>
    );
};

export default SettingsAccountDetailsPage;
