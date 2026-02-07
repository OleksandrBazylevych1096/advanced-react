import {useParams} from "react-router";

import {useGetCategoryBreadcrumbsQuery, useGetCategoryBySlugQuery} from "@/pages/Category/api/categoryPageApi.ts";

import {CategoryNavigation} from "@/widgets/CategoryNavigation";
import {Footer} from "@/widgets/Footer";
import {Header} from "@/widgets/Header";
import {PromoCarousel} from "@/widgets/PromoCarousel";

import {productFiltersReducer} from "@/features/productFilters";
import {ProductFilters} from "@/features/productFilters/ui/ProductFilters/ProductFilters.tsx";
import {ProductFiltersControls} from "@/features/productFilters/ui/ProductFiltersControls/ProductFiltersControls.tsx";

import {Catalog} from "@/entities/product";

import {routePaths, type SupportedLngsType} from "@/shared/config";
import {DynamicModuleLoader} from "@/shared/lib";
import {useSlugSync} from "@/shared/lib/hooks/useSlugSync.ts";
import {AppPage} from "@/shared/ui";
import {Breadcrumbs} from "@/shared/ui/Breadcrumbs/Breadcrumbs.tsx";

import styles from "./CategoryPage.module.scss";

const CategoryPage = () => {

    const {slug, lng} = useParams<{ slug: string, lng: SupportedLngsType }>()
    const {data: category, isSuccess} = useGetCategoryBySlugQuery({slug: slug!, locale: lng!})
    const {data: breadcrumbs} = useGetCategoryBreadcrumbsQuery({
        id: category?.id,
        locale: lng!
    }, {skip: !category?.id})

    useSlugSync({
        languageParam: lng,
        slugMap: category?.slugMap,
        enabled: isSuccess,
        routePath: routePaths.category
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
