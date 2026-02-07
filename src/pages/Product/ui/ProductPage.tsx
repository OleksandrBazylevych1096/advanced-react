import {useParams} from "react-router";

import {useGetCategoryBreadcrumbsQuery} from "@/pages/Category/api/categoryPageApi.ts";
import {useGetProductBySlugQuery} from "@/pages/Product/api/productPageApi.ts";
import {generateProductBreadcrumbs} from "@/pages/Product/lib/generateProductBreadcrumbs/generateProductBreadcrumbs.ts";
import {ProductImageCarousel} from "@/pages/Product/ui/ProductImageCarousel/ProductImageCarousel.tsx";
import {ProductInfo} from "@/pages/Product/ui/ProductInfo/ProductInfo.tsx";

import {BestSellingProducts} from "@/widgets/BestSellingProducts";
import {Footer} from "@/widgets/Footer";
import {Header} from "@/widgets/Header";

import {routePaths, type SupportedLngsType} from "@/shared/config";
import {useSlugSync} from "@/shared/lib/hooks/useSlugSync.ts";
import {AppPage} from "@/shared/ui";
import {Breadcrumbs} from "@/shared/ui/Breadcrumbs/Breadcrumbs.tsx";

import styles from "./ProductPage.module.scss";

const ProductPage = () => {

    const {slug, lng} = useParams<{ slug: string, lng: SupportedLngsType }>()
    const {data: product, isSuccess, isFetching, isError} = useGetProductBySlugQuery({slug: slug!, locale: lng!})

    const {data: categoryBreadcrumbs} = useGetCategoryBreadcrumbsQuery({
        id: product?.categoryId,
        locale: lng!
    }, {
        skip: !product?.categoryId
    })

    const breadcrumbs = generateProductBreadcrumbs(categoryBreadcrumbs, product?.name)

    useSlugSync({
        languageParam: lng,
        slugMap: product?.slugMap,
        enabled: isSuccess,
        routePath: routePaths.product
    })

    return (
        <AppPage>
            <Header/>
            <AppPage.Content className={styles.content}>
                <Breadcrumbs className={styles.breadcrumbs} items={breadcrumbs}/>
                <div className={styles.container}>
                    <div className={styles.carouselContainer}>
                        <ProductImageCarousel images={product?.images}
                                              isLoading={isFetching} error={isError}/>
                    </div>
                    <ProductInfo product={product} error={isError} isLoading={isFetching}/>
                </div>
                <BestSellingProducts/>
            </AppPage.Content>
            <Footer/>
        </AppPage>
    );
};

export default ProductPage;
