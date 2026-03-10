import type {ReactNode} from "react";
import {useTranslation} from "react-i18next";

import type {CurrencyType} from "@/shared/config";
import {cn} from "@/shared/lib";
import {AppImage, Price, Typography} from "@/shared/ui";

import type {CartItem} from "../../model/types/CartSchema";

import styles from "./CartItemRow.module.scss";

interface CartItemRowProps {
    item: CartItem;
    compact?: boolean;
    validationIssues?: string[];
    currency: CurrencyType;
    controls?: ReactNode;
}

export const CartItemRow = (props: CartItemRowProps) => {
    const {item, compact = false, validationIssues = [], currency, controls} = props;
    const {i18n} = useTranslation();

    const {product, quantity} = item;
    const hasValidationIssues = validationIssues.length > 0;
    const mainImage = product.images?.find((img) => img.isMain) ?? product.images?.[0];
    const lineTotal = product.price * quantity;

    return (
        <div className={styles.row} aria-invalid={hasValidationIssues}>
            <div className={styles.imageWrapper}>
                <AppImage
                    src={mainImage?.url}
                    alt={mainImage?.alt || product.name}
                    className={styles.image}
                    containerClassName={styles.imageContainer}
                    showErrorMessage={false}
                />
                {hasValidationIssues && <span className={styles.badge}>!</span>}
            </div>

            <div className={styles.info}>
                <Typography as="h4" className={styles.name} variant="bodySm" weight="medium">
                    {product.name}
                </Typography>
                <Price
                    currency={currency}
                    language={i18n.language}
                    price={product.price}
                    oldPrice={product.oldPrice}
                    size="s"
                />
                {hasValidationIssues && (
                    <ul className={styles.validationList}>
                        {validationIssues.map((issue, index) => (
                            <li
                                key={`${item.productId}-${index}-${issue}`}
                                className={styles.validationIssue}
                            >
                                <Typography as="span" variant="caption" tone="danger">
                                    {issue}
                                </Typography>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className={cn(styles.controls, styles.compactControls)}>
                {controls ? (
                    controls
                ) : (
                    <Typography
                        as="span"
                        className={styles.quantity}
                        variant="bodySm"
                        weight="medium"
                    >
                        {quantity}
                    </Typography>
                )}
            </div>

            {!compact && (
                <div className={styles.lineTotal}>
                    <Price
                        currency={currency}
                        language={i18n.language}
                        price={lineTotal}
                        size="m"
                    />
                </div>
            )}
        </div>
    );
};
