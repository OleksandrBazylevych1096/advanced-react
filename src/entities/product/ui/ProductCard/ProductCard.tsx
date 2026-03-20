import type {ReactNode} from "react";
import {useTranslation} from "react-i18next";
import {generatePath, useNavigate} from "react-router";

import {AppRoutes, type CurrencyType, routePaths} from "@/shared/config";
import {AppImage, Price, Typography} from "@/shared/ui";

import type {Product} from "../../model/types/Product";

import styles from "./ProductCard.module.scss";

export interface ProductCardProps {
    product: Product;
    currency: CurrencyType;
    action?: ReactNode;
}

export const ProductCard = ({product, currency, action}: ProductCardProps) => {
    const navigate = useNavigate();
    const {i18n, t} = useTranslation();

    const openProduct = () => {
        navigate(
            generatePath(routePaths[AppRoutes.PRODUCT], {
                lng: i18n.language,
                slug: product.slug,
            }),
        );
    };
    const img = product.images?.find((img) => img.isMain);

    return (
        <div
            className={styles.card}
            onClick={openProduct}
            data-testid={`product-card-${product.id}`}
        >
            <div className={styles.imgContainer}>
                <AppImage src={img?.url} alt={img?.alt || product.name} className={styles.img} />
                {action && (
                    <div className={styles.action} onClick={(e) => e.stopPropagation()}>
                        {action}
                    </div>
                )}
            </div>
            <div>
                <Typography as="h5" className={styles.title} variant="body" weight="semibold">
                    {product.name}
                </Typography>
                <Typography className={styles.subtitle} variant="body">
                    {product.shortDescription}
                </Typography>
                <Price
                    currency={currency}
                    language={i18n.language}
                    price={product.price}
                    oldPrice={product.oldPrice}
                />
                <div className={styles.metadata}>
                    {product.stock <= 10 && (
                        <Typography variant="bodySm" tone="primary" weight="semibold">
                            {t("products.itemsLeft", {count: product.stock})}
                        </Typography>
                    )}
                </div>
            </div>
        </div>
    );
};
