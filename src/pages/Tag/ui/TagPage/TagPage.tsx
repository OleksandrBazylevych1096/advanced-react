import {Catalog} from "@/widgets/Catalog";
import {PromoCarousel} from "@/widgets/PromoCarousel/ui/PromoCarousel/PromoCarousel";

import {
    ProductFilters,
    ProductFiltersControls,
    productFiltersReducer,
} from "@/features/product-filters";

import {DynamicModuleLoader} from "@/shared/lib/state";
import {Breadcrumbs} from "@/shared/ui/Breadcrumbs";

import styles from "./TagPage.module.scss";
import {useTagPage} from "./useTagPage/useTagPage";

const TagPage = () => {
    const {
        data: {tagId, breadcrumbs},
    } = useTagPage();

    return (
        <DynamicModuleLoader removeAfterUnmount reducers={{productFilters: productFiltersReducer}}>
            <div className={styles.content}>
                <ProductFilters tagId={tagId} />
                <div className={styles.wrapper}>
                    <Breadcrumbs className={styles.breadcrumbs} items={breadcrumbs} />
                    <PromoCarousel />
                    <ProductFiltersControls />
                    <Catalog tagId={tagId} />
                </div>
            </div>
        </DynamicModuleLoader>
    );
};

export default TagPage;
