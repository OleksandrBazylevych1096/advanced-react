import {useParams} from "react-router";

import {Catalog} from "@/widgets/Catalog";
import {CategoryNavigation} from "@/widgets/CategoryNavigation";
import {PromoCarousel} from "@/widgets/PromoCarousel";

import {
    ProductFilters,
    ProductFiltersControls,
    productFiltersReducer,
} from "@/features/product-filters";

import {DynamicModuleLoader} from "@/shared/lib/state";
import {Breadcrumbs} from "@/shared/ui/Breadcrumbs";

import styles from "./CategoryPage.module.scss";
import {useCategoryPage} from "./useCategoryPage/useCategoryPage.ts";

const CategoryPage = () => {
    const {slug} = useParams<{slug: string}>();
    const {
        data: {breadcrumbs, categoryId},
    } = useCategoryPage();

    return (
        <DynamicModuleLoader removeAfterUnmount reducers={{productFilters: productFiltersReducer}}>
            <div className={styles.content}>
                <ProductFilters categoryId={categoryId} />
                <div className={styles.wrapper}>
                    <Breadcrumbs className={styles.breadcrumbs} items={breadcrumbs} />
                    <PromoCarousel />
                    <CategoryNavigation slug={slug} />
                    <ProductFiltersControls />
                    <Catalog categoryId={categoryId} />
                </div>
            </div>
        </DynamicModuleLoader>
    );
};

export default CategoryPage;
