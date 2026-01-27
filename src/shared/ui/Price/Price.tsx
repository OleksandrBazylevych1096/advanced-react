import type {CurrencyType, SupportedLngsType} from "@/shared/config";
import {cn, formatCurrency} from "@/shared/lib";

import styles from "./Price.module.scss";

interface PriceProps {
    price: number;
    oldPrice?: number;
    language: SupportedLngsType;
    currency: CurrencyType;
}

export const Price = (props: PriceProps) => {
    const {currency, language, price, oldPrice} = props;

    return (
        <div className={styles.prices}>
      <span
          className={cn(styles.price, {
              [styles.hasDiscount]: !!oldPrice,
          })}
      >
        {formatCurrency(currency, language, price)}
      </span>
            <span className={styles.oldPrice}>
        {oldPrice &&
            formatCurrency(currency, language, oldPrice)}
      </span>
        </div>
    );
};
