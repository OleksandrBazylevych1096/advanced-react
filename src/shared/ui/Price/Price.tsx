import type { CurrencyType } from "@/shared/config";
import { cn } from "@/shared/lib";

import styles from "./Price.module.scss";

interface PriceProps {
  price: number;
  oldPrice?: number;
  language: string;
  currency: CurrencyType;
}

export const Price = (props: PriceProps) => {
  const { currency, language, price, oldPrice } = props;

  return (
    <div className={styles.prices}>
      <span
        className={cn(styles.price, {
          [styles.hasDiscount]: !!oldPrice,
        })}
      >
        {new Intl.NumberFormat(language, {
          style: "currency",
          currency: currency,
        }).format(price)}
      </span>
      <span className={styles.oldPrice}>
        {oldPrice &&
          new Intl.NumberFormat(language, {
            style: "currency",
            currency: currency,
          }).format(oldPrice)}
      </span>
    </div>
  );
};
