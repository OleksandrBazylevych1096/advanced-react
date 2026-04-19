import type {CurrencyType, SupportedLngsType} from "@/shared/config";
import {formatCurrency} from "@/shared/lib/formatting";
import {Stack} from "@/shared/ui/Stack";
import {Typography} from "@/shared/ui/Typography";

import styles from "./Price.module.scss";

type PriceSize = "xl" | "l" | "m" | "s";

type PriceTypographyConfig = {
    variant: "display" | "heading" | "body" | "bodySm" | "caption";
    weight: "regular" | "medium" | "semibold" | "bold";
};

interface PriceProps {
    price: number;
    oldPrice?: number;
    language: SupportedLngsType;
    currency: CurrencyType;
    size?: PriceSize;
}

const currentPriceTypographyBySize: Record<PriceSize, PriceTypographyConfig> = {
    xl: {variant: "display", weight: "bold"},
    l: {variant: "heading", weight: "semibold"},
    m: {variant: "body", weight: "semibold"},
    s: {variant: "bodySm", weight: "regular"},
};

const oldPriceTypographyBySize: Record<PriceSize, PriceTypographyConfig> = {
    xl: {variant: "heading", weight: "bold"},
    l: {variant: "body", weight: "semibold"},
    m: {variant: "bodySm", weight: "semibold"},
    s: {variant: "caption", weight: "regular"},
};

export const Price = (props: PriceProps) => {
    const {currency, language, price, oldPrice, size = "l"} = props;
    const currentPriceTypography = currentPriceTypographyBySize[size];
    const oldPriceTypography = oldPriceTypographyBySize[size];

    return (
        <Stack className={styles.prices} direction="row" gap={8} align="center">
            <Typography
                as="span"
                variant={currentPriceTypography.variant}
                weight={currentPriceTypography.weight}
                tone={oldPrice ? "success" : "default"}
            >
                {formatCurrency(currency, language, price)}
            </Typography>
            {oldPrice && (
                <Typography
                    as="span"
                    variant={oldPriceTypography.variant}
                    weight={oldPriceTypography.weight}
                    tone="muted"
                    className={styles.oldPrice}
                >
                    {formatCurrency(currency, language, oldPrice)}
                </Typography>
            )}
        </Stack>
    );
};
