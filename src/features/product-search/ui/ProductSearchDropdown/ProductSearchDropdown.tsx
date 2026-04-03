import {useTranslation} from "react-i18next";

import type {Product} from "@/entities/product";
import {selectUserCurrency} from "@/entities/user";

import {useAppSelector} from "@/shared/lib/state";
import {AppImage} from "@/shared/ui/AppImage";
import {Button} from "@/shared/ui/Button";
import {Price} from "@/shared/ui/Price";
import {Stack} from "@/shared/ui/Stack";
import {EmptyState} from "@/shared/ui/StateViews";
import {Typography} from "@/shared/ui/Typography";

import styles from "./ProductSearchDropdown.module.scss";
import {ProductSearchDropdownSkeleton} from "./ProductSearchDropdownSkeleton";

interface ProductSearchDropdownProps {
    suggestions: Product[];
    isFetchingSuggestions: boolean;
    hasNoSuggestions: boolean;
    onOpenProduct: (product: Product) => void;
}

export const ProductSearchDropdown = ({
    suggestions,
    isFetchingSuggestions,
    hasNoSuggestions,
    onOpenProduct,
}: ProductSearchDropdownProps) => {
    const {t, i18n} = useTranslation();
    const currency = useAppSelector(selectUserCurrency);
    const language = i18n.language;

    return (
        <div className={styles.dropdown} data-testid="header-product-search-dropdown">
            {isFetchingSuggestions && <ProductSearchDropdownSkeleton />}

            {!isFetchingSuggestions &&
                suggestions.map((product) => (
                    <Button
                        key={product.id}
                        theme="ghost"
                        form="rounded"
                        fullWidth
                        className={styles.suggestion}
                        onClick={() => onOpenProduct(product)}
                    >
                        <Stack
                            direction="row"
                            gap={10}
                            align="center"
                            className={styles.suggestionBody}
                        >
                            <AppImage
                                src={product.images.find((img) => img.isMain)?.url}
                                alt={product.images.find((img) => img.isMain)?.alt || product.name}
                                containerClassName={styles.suggestionImage}
                                className={styles.suggestionImage}
                                objectFit="cover"
                                showErrorMessage={false}
                            />
                            <Stack gap={4} align="start" className={styles.suggestionText}>
                                <Typography as="span" weight="medium">
                                    {product.name}
                                </Typography>
                                <Typography as="span" variant="bodySm" tone="muted">
                                    {product.shortDescription}
                                </Typography>
                            </Stack>
                            <div className={styles.suggestionPrice}>
                                <Price
                                    currency={currency}
                                    language={language}
                                    price={product.price}
                                    oldPrice={product.oldPrice}
                                    size="s"
                                />
                            </div>
                        </Stack>
                    </Button>
                ))}

            {hasNoSuggestions && <EmptyState title={t("search.autocomplete.empty")} />}
        </div>
    );
};
