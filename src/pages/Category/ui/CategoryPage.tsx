import {Catalog} from "@/widgets/Catalog";
import {CategoryNavigation} from "@/widgets/CategoryNavigation";
import {Footer} from "@/widgets/Footer";
import {Header} from "@/widgets/Header";
import {PromoCarousel} from "@/widgets/PromoCarousel";

import {ProductFilters, ProductFiltersControls, productFiltersReducer,} from "@/features/product-filters";

import {DynamicModuleLoader} from "@/shared/lib";
import {AppPage} from "@/shared/ui";
import {Breadcrumbs} from "@/shared/ui/Breadcrumbs/Breadcrumbs.tsx";

import {useCategoryPageController} from "../model/controllers/useCategoryPageController";

import styles from "./CategoryPage.module.scss";

const CategoryPage = () => {
    const {
        data: {breadcrumbs, categoryId},
    } = useCategoryPageController();


    return (
        <DynamicModuleLoader removeAfterUnmount reducers={{productFilters: productFiltersReducer}}>
            <AppPage>
                <Header/>
                <AppPage.Content className={styles.content}>
                    <ProductFilters categoryId={categoryId}/>
                    <div className={styles.wrapper}>
                        <Breadcrumbs className={styles.breadcrumbs} items={breadcrumbs}/>
                        <PromoCarousel/>
                        <CategoryNavigation/>
                        <ProductFiltersControls/>
                        <Catalog categoryId={categoryId}/>
                    </div>
                </AppPage.Content>
                <Footer/>
            </AppPage>
        </DynamicModuleLoader>
    );
};

export default CategoryPage;
