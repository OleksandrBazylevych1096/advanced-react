import {useCatalog} from "@/widgets/Catalog/lib/useCatalog.ts";

import {ProductCard, ProductCardSkeleton} from "@/entities/product";

import styles from './Catalog.module.scss'


const CATALOG_PRODUCT_CARDS_SKELETON_COUNT = 8

export const Catalog = () => {
    const {isFetchingNextPage, hasNextPage, isLoading, error, products, sentryRef} = useCatalog()

    if (isLoading) {
        return <div className={styles.grid}>
            {Array.from({length: CATALOG_PRODUCT_CARDS_SKELETON_COUNT}).map((_, index) => (
                <ProductCardSkeleton key={`skeleton-${index}`}/>
            ))}
        </div>
    }

    if (error) {
        return <div>error</div>
    }

    if (!products || products.length === 0) {
        return <div>No data</div>
    }


    return (
        <div>
            <div className={styles.grid}>
                {products.map((product) => (
                    <ProductCard key={product.id} product={product}/>
                ))}
                {isFetchingNextPage && Array.from({length: CATALOG_PRODUCT_CARDS_SKELETON_COUNT}).map((_, index) => (
                    <ProductCardSkeleton key={`loading-skeleton-${index}`}/>
                ))}
            </div>

            {hasNextPage && (
                <div ref={sentryRef} className={styles.loadingTrigger}/>
            )}
        </div>
    );
};
