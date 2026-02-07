import {useTranslation} from "react-i18next";

import type {Product} from "@/entities/product";
import {selectUserCurrency} from "@/entities/user";

import {useAppSelector} from "@/shared/lib";
import {Button, EmptyState, ErrorState, Price} from "@/shared/ui";

import styles from './ProductInfo.module.scss'
import {ProductInfoSkeleton} from "./ProductInfoSkeleton";

interface ProductInfoProps {
    product?: Product
    isLoading?: boolean
    error?: boolean
}

export const ProductInfo = ({product, error, isLoading}: ProductInfoProps) => {

    const currency = useAppSelector(selectUserCurrency)
    const {i18n, t} = useTranslation()

    if (isLoading) return <ProductInfoSkeleton/>

    if (error) return <ErrorState/>

    if (!product) return <EmptyState title={"Products"}/>

    return <div className={styles.productInfo}>
        <h5 className={styles.title}>{product.name} </h5>
        <p className={styles.subtitle}>{product.description}</p>
        <Price
            size={'xl'}
            currency={currency}
            language={i18n.language}
            price={product.price}
            oldPrice={product.oldPrice}
        />
        <div className={styles.metadata}>
            {product.stock <= 10 && (
                <p className={styles.amountLeft}>
                    {t("products.itemsLeft", {count: product.stock})}
                </p>
            )}
        </div>
        <Button fullWidth size={'lg'}>Add to Cart</Button>
    </div>

}