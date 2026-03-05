import {useTranslation} from "react-i18next";

import {AddToCartButton} from "@/features/add-to-cart";

import type {Product} from "@/entities/product";
import {selectUserCurrency} from "@/entities/user";

import {useAppSelector} from "@/shared/lib";
import {EmptyState, ErrorState, Price, Typography} from "@/shared/ui";

import styles from "./ProductInfo.module.scss";
import {ProductInfoSkeleton} from "./ProductInfoSkeleton";

interface ProductInfoProps {
    product?: Product;
    isLoading?: boolean;
    error?: boolean;
}

export const ProductInfo = ({product, error, isLoading}: ProductInfoProps) => {
    const currency = useAppSelector(selectUserCurrency);
    const {i18n, t} = useTranslation();

    if (isLoading) return <ProductInfoSkeleton/>;

    if (error) return <ErrorState/>;

    if (!product) return <EmptyState title={"Products"}/>;

    return (
        <div className={styles.productInfo}>
            <Typography as="h5" className={styles.title} variant="display" weight="bold">
                {product.name}
            </Typography>
            <Typography className={styles.subtitle} variant="heading">
                {product.description}
            </Typography>
            <Price
                size={"xl"}
                currency={currency}
                language={i18n.language}
                price={product.price}
                oldPrice={product.oldPrice}
            />
            <div className={styles.metadata}>
                {product.stock <= 10 && (
                    <Typography variant="heading" tone="primary" weight="semibold">
                        {t("products.itemsLeft", {count: product.stock})}
                    </Typography>
                )}
            </div>
            <AddToCartButton product={product}/>
        </div>
    );
};
