import type {CurrencyType, SupportedLngsType} from "@/shared/config";
import {cn, formatCurrency} from "@/shared/lib";
import {Stack} from "@/shared/ui/Stack/Stack";

import styles from "./Price.module.scss";

type PriceSize = "xl" | "l" | "m" | "s";

interface PriceProps {
    price: number;
    oldPrice?: number;
    language: SupportedLngsType;
    currency: CurrencyType;
    size?: PriceSize;
}

export const Price = (props: PriceProps) => {
    const {currency, language, price, oldPrice, size = "l"} = props;

    return (
        <Stack className={styles.prices} direction="row" gap={8} align="center">
            <span
                className={cn(styles.price, styles[size], {
                    [styles.hasDiscount]: !!oldPrice,
                })}
            >
                {formatCurrency(currency, language, price)}
            </span>
            <span className={cn(styles.oldPrice, styles[size])}>
                {oldPrice && formatCurrency(currency, language, oldPrice)}
            </span>
        </Stack>
    );
};
