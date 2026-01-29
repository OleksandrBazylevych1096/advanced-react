import {useParams} from "react-router";

import {useGetCategoryBreadcrumbsQuery, useGetCategoryBySlugQuery} from "@/pages/Category/api/categoryPageApi.ts";
import {useCategorySlugSync} from "@/pages/Category/lib/useCategorySlugSync/useCategorySlugSync.ts";

import {CategoryNavigation} from "@/widgets/CategoryNavigation";
import {Footer} from "@/widgets/Footer";
import {Header} from "@/widgets/Header";
import {PromoCarousel} from "@/widgets/PromoCarousel";

import {productFiltersReducer} from "@/features/productFilters";
import {ProductFilters} from "@/features/productFilters/ui/ProductFilters/ProductFilters.tsx";
import {ProductFiltersControls} from "@/features/productFilters/ui/ProductFiltersControls/ProductFiltersControls.tsx";

import {Catalog} from "@/entities/product";

import type {SupportedLngsType} from "@/shared/config";
import {DynamicModuleLoader} from "@/shared/lib";
import {AppPage} from "@/shared/ui";
import {Breadcrumbs} from "@/shared/ui/Breadcrumbs/Breadcrumbs.tsx";

import styles from "./CategoryPage.module.scss";

const CategoryPage = () => {

    const {slug, lng} = useParams<{ slug: string, lng: SupportedLngsType }>()
    const {data: category, isSuccess} = useGetCategoryBySlugQuery({slug: slug!, locale: lng!})
    const {data: breadcrumbs} = useGetCategoryBreadcrumbsQuery({
        slug: slug!,
        locale: lng!
    })

    useCategorySlugSync({
        languageParam: lng,
        category,
        enabled: isSuccess
    })


    return (
        <DynamicModuleLoader removeAfterUnmount reducers={{productFilters: productFiltersReducer}}>
            <AppPage>
                <Header/>
                <AppPage.Content className={styles.content}>
                    <ProductFilters/>
                    <div className={styles.wrapper}>
                        <Breadcrumbs className={styles.breadcrumbs} items={breadcrumbs}/>
                        <PromoCarousel/>
                        <CategoryNavigation/>
                        <ProductFiltersControls/>
                        <Catalog/>
                    </div>
                </AppPage.Content>
                <Footer/>
            </AppPage>
        </DynamicModuleLoader>
    );
};

export default CategoryPage;
