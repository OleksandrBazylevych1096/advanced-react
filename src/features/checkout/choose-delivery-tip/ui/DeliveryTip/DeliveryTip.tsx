import {useTranslation} from "react-i18next";

import {formatCurrency} from "@/shared/lib/formatting";
import {Button} from "@/shared/ui/Button";
import {Input} from "@/shared/ui/Input";
import {Stack} from "@/shared/ui/Stack";
import {Typography} from "@/shared/ui/Typography";

import {useChooseDeliveryTipController} from "../../model/controllers/useChooseDeliveryTipController/useChooseDeliveryTipController";

export const DeliveryTip = () => {
    const {i18n, t} = useTranslation("checkout");
    const {
        data: {amount, currency, customTipValue, shouldShowCustomInput, presetValues},
        actions: {selectPresetTip, selectCustomTip, setCustomTipValue},
    } = useChooseDeliveryTipController();

    return (
        <Stack gap={12}>
            <Typography as="h3" variant="heading" weight="bold">
                {t("deliveryTip.title")}
            </Typography>

            <Stack direction="row" gap={4} wrap="wrap">
                {presetValues.map((preset) => (
                    <Button
                        key={preset}
                        type="button"
                        theme={amount === preset ? "primary" : "tertiary"}
                        size="sm"
                        onClick={() => selectPresetTip(preset)}
                    >
                        {formatCurrency(currency, i18n.language, preset)}
                    </Button>
                ))}
                <Button
                    type="button"
                    theme={shouldShowCustomInput ? "primary" : "tertiary"}
                    size="sm"
                    onClick={selectCustomTip}
                >
                    {t("deliveryTip.other")}
                </Button>
            </Stack>

            {shouldShowCustomInput && (
                <Input
                    currency={currency}
                    type="currency"
                    min={0}
                    value={customTipValue}
                    onChange={setCustomTipValue}
                    placeholder={t("deliveryTip.customPlaceholder")}
                    fullWidth
                />
            )}
        </Stack>
    );
};
