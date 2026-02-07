import {useTranslation} from "react-i18next";
import {generatePath, useNavigate} from "react-router";

import {selectUserCurrency} from "@/entities/user/model/selectors/selectUserCurrency/selectUserCurrency";

import AddIcon from "@/shared/assets/icons/Add.svg?react";
import {routePaths} from "@/shared/config";
import {useAppSelector} from "@/shared/lib";
import {AppIcon, AppImage, Button, Price} from "@/shared/ui";

import type {Product} from "../../model/types/Product";

import styles from "./ProductCard.module.scss";

interface ProductCardProps {
    product: Product;
}

export const ProductCard = ({product}: ProductCardProps) => {
    const navigate = useNavigate()
    const {i18n, t} = useTranslation()

    const handleCardClick = () => {
        const path = generatePath(routePaths.product, {
            lng: i18n.language,
            slug: product.slug
        })
        navigate(path)
    }
    const currency = useAppSelector(selectUserCurrency);
    const img = product.images?.find((img) => img.isMain);

    return (
        <div className={styles.card} onClick={handleCardClick} data-testid={`product-card-${product.id}`}>
            <div className={styles.imgContainer}>
                <AppImage
                    src={img?.url}
                    alt={img?.alt || product.name}
                    className={styles.img}
                />
                <Button size="md" className={styles.button} form="circle">
                    <AppIcon Icon={AddIcon} size={24}/>
                </Button>
            </div>
            <div>
                <h5 className={styles.title}>{product.name} </h5>
                <p className={styles.subtitle}>{product.shortDescription}</p>
                <Price
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
            </div>
        </div>
    );
};
