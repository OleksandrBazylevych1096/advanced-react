import {useTranslation} from "react-i18next";
import {useParams} from "react-router";

import {useGetCategoryBreadcrumbsQuery} from "@/pages/Category/api/categoryPageApi.ts";

import {CategoryNavigation} from "@/widgets/CategoryNavigation";
import {Footer} from "@/widgets/Footer";
import {Header} from "@/widgets/Header";
import {PromoCarousel} from "@/widgets/PromoCarousel";

import {productFiltersReducer} from "@/features/productFilters";
import {ProductFilters} from "@/features/productFilters/ui/ProductFilters/ProductFilters.tsx";

import {Catalog} from "@/entities/product";

import {DynamicModuleLoader} from "@/shared/lib";
import {AppPage} from "@/shared/ui";
import {Breadcrumbs} from "@/shared/ui/Breadcrumbs/Breadcrumbs.tsx";

import styles from "./CategoryPage.module.scss";

const CategoryPage = () => {
    const {slug} = useParams()
    const {i18n} = useTranslation()
    const {data: breadcrumbs} = useGetCategoryBreadcrumbsQuery({slug: slug!, locale: i18n.language}, {skip: !slug})


    return (
        <DynamicModuleLoader reducers={{productFilters: productFiltersReducer}}>
            <AppPage>
                <Header/>

                <AppPage.Content className={styles.content}>
                    <div className={styles.sidebar}>
                        <ProductFilters/>
                    </div>
                    <div className={styles.wrapper}>
                        <Breadcrumbs className={styles.breadcrumbs} items={breadcrumbs}/>
                        <PromoCarousel/>
                        <CategoryNavigation/>
                        <Catalog/>
                    </div>
                </AppPage.Content>
                <Footer/>
            </AppPage>
        </DynamicModuleLoader>
    );
};

export default CategoryPage;
